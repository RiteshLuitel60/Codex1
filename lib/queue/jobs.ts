import { Queue, Worker } from "bullmq";
import { redisConnection } from "./connection";
import { runSingleIngestionPass } from "@/lib/ingestion/pipeline";

export const ingestionQueue = new Queue("ingestion", { connection: redisConnection });

export async function enqueueScheduledRefresh() {
  await ingestionQueue.add("refresh-leaders", {}, { removeOnComplete: 20, removeOnFail: 20 });
}

export function startIngestionWorker() {
  return new Worker(
    "ingestion",
    async () => {
      return runSingleIngestionPass();
    },
    { connection: redisConnection }
  );
}
