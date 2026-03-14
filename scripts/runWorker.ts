import { startIngestionWorker } from "@/lib/queue/jobs";

const worker = startIngestionWorker();

worker.on("completed", (job) => {
  console.log(`Completed job ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Failed job ${job?.id}:`, error.message);
});
