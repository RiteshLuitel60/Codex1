import { PrismaClient, SourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.upsert({
    where: { domain: 'presidencia.example.gov' },
    update: {},
    create: {
      domain: 'presidencia.example.gov',
      name: 'Example Presidential Office',
      type: SourceType.OFFICIAL_GOVERNMENT,
      baseCredibility: 0.94,
      officialSignal: 1,
      independentSignal: 0.8,
      transparencySignal: 0.92
    }
  });

  const country = await prisma.country.upsert({
    where: { iso2: 'EX' },
    update: {},
    create: {
      iso2: 'EX',
      iso3: 'EXP',
      name: 'Example Republic',
      slug: 'example-republic',
      region: 'Global North',
      governmentType: 'Semi-presidential republic',
      flagEmoji: '🏳️',
      profile: 'Example Republic is a fictional dataset entry used for MVP demonstrations.'
    }
  });

  const leader = await prisma.leader.create({
    data: {
      fullName: 'Alex Meridian',
      party: 'Unity Alliance',
      profile: 'Head of state focused on climate policy and digital governance.'
    }
  });

  const assignment = await prisma.leaderAssignment.create({
    data: {
      countryId: country.id,
      leaderId: leader.id,
      role: 'Head of State',
      officialTitle: 'President',
      assumedOfficeAt: new Date('2022-07-01'),
      predecessor: 'Jordan Vale',
      sourceConfidence: 0.91,
      citations: {
        create: {
          sourceId: source.id,
          url: 'https://presidencia.example.gov/office/president',
          excerpt: 'Official profile of President Alex Meridian.',
          trustScore: 0.94
        }
      }
    }
  });

  await prisma.verificationSnapshot.create({
    data: {
      countryId: country.id,
      confidenceScore: 0.91,
      conflictDetected: false,
      payload: {
        leaderAssignmentId: assignment.id,
        methodology: 'Weighted source credibility + conflict penalty'
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
