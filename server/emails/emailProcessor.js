import { client } from "../utils/redisClient.js";
import {
  sendOrderConfirmation,
  sendPasswordResetCode,
  sendRegistrationConfirmation,
} from "./email.js";

export const emailProcessor = async () => {
  // Blocking commands (BRPOP) occupy the whole connection until they resolve,
  // so this must run on its own connection, not the shared `client` used to
  // serve requests (auth, product cache, etc.) — otherwise every other
  // command queues behind the blocking pop and hangs indefinitely.
  const subscriber = client.duplicate();
  await subscriber.connect();

  while (true) {
    const job = await subscriber.brPop("queue:email", 0);

    processJob(JSON.parse(job.element));
  }
};

const processJob = async (job) => {
  switch (job.type) {
    case "register":
      console.log("email sent");
      await sendRegistrationConfirmation(job);
      break;

    case "order":
      await sendOrderConfirmation(job);
      break;

    case "password":
      await sendPasswordResetCode(job);
      break;

    default:
      break;
  }
};
