import { client } from "../utils/redisClient.js";
import { sendOrderConfirmation, sendPasswordResetCode, sendRegistrationConfirmation } from "./email.js";


const emailProcessor = () => {
  while(true){
    const job = await client.brPop("queue:email", 0);
    
    process(JSON.parse(job.element))
  }
}

const process = async (job) => {
  switch (job.type) {
    case "register":
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