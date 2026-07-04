import { client } from "../utils/redisClient.js";
import { sendOrderConfirmation, sendPasswordResetCode, sendRegistrationConfirmation } from "./email.js";


export const emailProcessor = async () => {
  while (true) {
    const job = await client.brPop("queue:email", 0);

    processJob(JSON.parse(job.element));
  }
};

const processJob = async (job) => {
  switch (job.type) {
    case "register":
          console.log("email sent")
          await sendRegistrationConfirmation(job);
      break;
    
      case "order":
          await sendOrderConfirmation(job);
      break;

      case "password":
        await sendPasswordResetCode(job)
      break;

      // case "invoice":
      //     await sendRegistrationConfirmation(job);
      // break;
  
    default:
      break;
  }
}