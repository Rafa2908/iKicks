import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

export const sendEmail = async (code) => {
  const { data, error } = await resend.emails.send({
    from: "iKicks <onboarding@resend.dev>",
    to: ["papaus02@gmail.com"],
    subject: "Test",
    html: `<p>Here's your temporary code: ${code}</p>
    <p>Code will expire in 15 minutes.</p>
    `,
  });

  if (error) {
    console.error(error);
  }

  console.log(data);
};
