import "dotenv/config";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_KEY);

const getEmailHtml = (code) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Temporary Reset Code</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #0a0a0a;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="
                      font-size: 22px;
                      font-weight: 900;
                      letter-spacing: 0.15em;
                      color: #ffffff;
                    ">iKicks</span>
                  </td>
                  <td align="right">
                    <span style="
                      font-size: 11px;
                      letter-spacing: 0.2em;
                      text-transform: uppercase;
                      color: #555;
                    ">Verification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40%" height="1" style="background-color: #00f0ff; font-size: 0; line-height: 0;">&nbsp;</td>
                  <td width="30%" height="1" style="background-color: #444; font-size: 0; line-height: 0;">&nbsp;</td>
                  <td width="30%" height="1" style="background-color: transparent; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Label -->
          <tr>
            <td style="padding-bottom: 12px;">
              <p style="
                margin: 0;
                font-size: 13px;
                letter-spacing: 0.25em;
                text-transform: uppercase;
                color: #00f0ff;
              ">One-Time Code</p>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding-bottom: 36px;">
              <p style="
                margin: 0;
                font-size: 28px;
                font-weight: 800;
                line-height: 1.2;
                color: #ffffff;
                letter-spacing: -0.02em;
              ">Here's your<br/>temporary access code.</p>
            </td>
          </tr>

          <!-- Code Block -->
          <tr>
            <td style="padding-bottom: 36px;">
              <div style="
                background-color: #141414;
                border: 1px solid #2a2a2a;
                border-left: 4px solid #00f0ff;
                border-radius: 4px;
                padding: 28px 32px;
                text-align: center;
              ">
                <span style="
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 42px;
                  font-weight: 700;
                  letter-spacing: 0.3em;
                  color: #00f0ff;
                ">${code}</span>
              </div>
            </td>
          </tr>

          <!-- Expiry note -->
          <tr>
            <td style="padding-bottom: 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="
                    background-color: #141414;
                    border-radius: 4px;
                    padding: 14px 20px;
                  ">
                    <p style="
                      margin: 0;
                      font-size: 13px;
                      color: #888;
                      letter-spacing: 0.03em;
                    ">
                      &#9203; &nbsp;This code expires in <strong style="color: #fff;">15 minutes</strong>.
                      Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom: 28px;">
              <div style="height: 1px; background-color: #1e1e1e;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <p style="
                margin: 0;
                font-size: 12px;
                color: #444;
                letter-spacing: 0.04em;
                line-height: 1.7;
              ">
                If you didn't request this code, you can safely ignore this email.
                &nbsp;·&nbsp; © ${new Date().getFullYear()} iKicks. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendEmail = async (code) => {
  const { data, error } = await resend.emails.send({
    from: "iKicks <onboarding@resend.dev>",
    to: ["papaus02@gmail.com"],
    subject: "Your Temporary password reset code",
    html: getEmailHtml(code),
  });

  if (error) {
    console.error(error);
  }
  console.log(data);
};
