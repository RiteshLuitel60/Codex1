import { Worker } from 'bullmq';
import { prisma } from '@/lib/prisma';
import { calculateConfidence, detectConflict } from '@/lib/source-ranking';

const connection = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379)
};

const worker = new Worker(
  'leaders-ingestion',
  async (job) => {
    if (job.name !== 'refresh-country') {
      return;
    }

    const country = await prisma.country.findUnique({
      where: { id: job.data.countryId },
      include: {
        leaderAssignments: {
          where: { isCurrent: true },
          include: {
            leader: true,
            citations: { include: { source: true } }
          }
        }
      }
    });

    if (!country) {
      return;
    }

    const conflictsByRole = country.leaderAssignments.map((assignment) => {
      const candidateNames = assignment.citations.length
        ? assignment.citations.map(() => assignment.leader.fullName)
        : [assignment.leader.fullName];
      return { role: assignment.role, ...detectConflict(candidateNames) };
    });

    const hasConflict = conflictsByRole.some((row) => row.conflicting);
    const conflictPenalty = hasConflict ? 0.1 : 0;

    const confidence = calculateConfidence(
      country.leaderAssignments.map((assignment) => assignment.sourceConfidence),
      conflictPenalty
    );

    await prisma.verificationSnapshot.create({
      data: {
        countryId: country.id,
        confidenceScore: confidence,
        conflictDetected: hasConflict,
        payload: {
          strategy: 'auto-refresh',
          conflictsByRole,
          assignmentCount: country.leaderAssignments.length
        }
      }
    });

    if (hasConflict) {
      await prisma.conflict.create({
        data: {
          countryId: country.id,
          role: 'Automated role conflict',
          summary: 'Automated verifier detected disagreement in at least one role after source reconciliation.',
          evidence: { conflictsByRole },
          confidenceDelta: conflictPenalty
        }
      });
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Refresh completed for ${job.id}`);
});

worker.on('failed', (job, error) => {
  console.error(`Refresh failed for ${job?.id}`, error);
});
