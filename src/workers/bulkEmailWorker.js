// import { Worker } from "bullmq";
// import redis from "../config/redis.js";
// import { sendEmailTemplate } from "../services/email.js";
// import { containerEmailTemplate } from "../templates/containerCreatedTemplate.js";

// const bulkEmailWorker = new Worker(
//   "bulk-email",
//   async (job) => {
//     const { email, container } = job.data;

//     await sendEmailTemplate({
//       to: email,
//       subject: `New Container Created - ${container.containerNumber}`,
//       htmlTemplate: containerEmailTemplate({
//         containerNumber: container.containerNumber,
//         origin: container.origin,
//         destination: container.destination,
//         createdBy: container.nvoccCompany,
//       }),
//     });
//   },
//   {
//     connection: redis,
//   }
// );

// bulkEmailWorker.on("completed", (job) => {
//   console.log(`Email sent successfully to ${job.data.email}`);
// });

// bulkEmailWorker.on("failed", (job, err) => {
//   console.error(`Failed to send email to ${job.data.email}`, err);
// });
