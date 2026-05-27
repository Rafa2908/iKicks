import "dotenv/config";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_KEY);

const registrationHtml = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to iKicks</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:0;">
 
    <!-- Top bar -->
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;">
          <tr>
            <td style="padding:8px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;color:#aaaaaa;letter-spacing:0.05em;">24/7 Customer Service</td>
                  <td align="center" style="font-size:11px;color:#aaaaaa;letter-spacing:0.05em;">Premium-Quality, Authentic Footwear for Sneaker Aficionados</td>
                  <td align="right" style="font-size:11px;color:#aaaaaa;letter-spacing:0.05em;">Contact Us</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
 
    <!-- Navbar -->
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#222222;border-top:1px solid #333333;">
          <tr>
            <td style="padding:14px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:0.05em;">iKicks</td>
                  <td align="right" style="font-size:11px;color:#888888;letter-spacing:0.15em;text-transform:uppercase;">New Arrivals &nbsp;·&nbsp; Jordan &nbsp;·&nbsp; Nike &nbsp;·&nbsp; Yeezy &nbsp;·&nbsp; New Balance</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
 
    <!-- Promo banner -->
    <tr>
      <td style="background-color:#1a72c7;padding:10px 24px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#ffffff;font-weight:600;letter-spacing:0.04em;line-height:1.8;">
          Order over $100 qualifies for Free Shipping &nbsp;·&nbsp; Promotion: 10% off entire order &nbsp;·&nbsp; Promo Code: <strong>KD2024</strong>
        </p>
      </td>
    </tr>
 
    <!-- Body -->
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">
 
          <!-- Welcome card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:4px;padding:32px 32px 24px;margin-bottom:16px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#1a72c7;font-weight:700;">Welcome to iKicks</p>
              <p style="margin:0 0 14px;font-size:24px;font-weight:800;color:#1a1a1a;line-height:1.2;">Hey ${name}, your account<br/>is ready. 👟</p>
              <p style="margin:0 0 20px;font-size:13px;color:#555555;line-height:1.75;">
                You're now part of the iKicks community — the home of premium-quality, authentic footwear for sneaker aficionados. Your account has been successfully created and you're ready to shop.
              </p>
 
              <!-- Account info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;border-left:3px solid #1a72c7;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999999;">Account name</p>
                    <p style="margin:0;font-size:14px;font-weight:700;color:#1a1a1a;">${name}</p>
                  </td>
                </tr>
              </table>
 
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <a href="#" style="display:inline-block;background-color:#2ecc40;color:#ffffff;font-size:13px;font-weight:700;padding:14px 36px;border-radius:3px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">Shop Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <tr><td style="height:12px;"></td></tr>
 
          <!-- Perks card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:4px;padding:24px 32px;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#1a72c7;font-weight:700;padding-bottom:10px;border-bottom:2px solid #1a72c7;">What you get as a member</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:8px 12px 8px 0;vertical-align:top;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#1a1a1a;">🚚 Free Shipping</p>
                    <p style="margin:0;font-size:12px;color:#888888;">On all orders over $100</p>
                  </td>
                  <td width="50%" style="padding:8px 0 8px 12px;vertical-align:top;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#1a1a1a;">✅ 100% Authentic</p>
                    <p style="margin:0;font-size:12px;color:#888888;">Every pair is verified</p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:8px 12px 0 0;vertical-align:top;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#1a1a1a;">🏷️ Exclusive Deals</p>
                    <p style="margin:0;font-size:12px;color:#888888;">Members-only promotions</p>
                  </td>
                  <td width="50%" style="padding:8px 0 0 12px;vertical-align:top;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#1a1a1a;">🔄 Easy Returns</p>
                    <p style="margin:0;font-size:12px;color:#888888;">Hassle-free return policy</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
        </table>
      </td>
    </tr>
 
    <!-- Footer -->
    <tr>
      <td style="background-color:#222222;padding:20px 24px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#777777;letter-spacing:0.04em;line-height:1.8;">
          You're receiving this because you created an account at iKicks.com<br/>
          © ${new Date().getFullYear()} iKicks · All rights reserved
        </p>
      </td>
    </tr>
 
  </table>
</body>
</html>
`;

const resetPasswordHtml = (code) => `
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
const OrderConfirmationHtml = (order) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed — iKicks</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:0;">
 
    <!-- Top bar -->
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;">
          <tr>
            <td style="padding:8px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;color:#aaaaaa;letter-spacing:0.05em;">24/7 Customer Service</td>
                  <td align="center" style="font-size:11px;color:#aaaaaa;letter-spacing:0.05em;">Premium-Quality, Authentic Footwear for Sneaker Aficionados</td>
                  <td align="right" style="font-size:11px;color:#aaaaaa;letter-spacing:0.05em;">Contact Us</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
 
    <!-- Navbar -->
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#222222;border-top:1px solid #333333;">
          <tr>
            <td style="padding:14px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:0.05em;">iKicks</td>
                  <td align="right" style="font-size:11px;color:#888888;letter-spacing:0.15em;text-transform:uppercase;">New Arrivals &nbsp;·&nbsp; Jordan &nbsp;·&nbsp; Nike &nbsp;·&nbsp; Yeezy &nbsp;·&nbsp; New Balance</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
 
    <!-- Promo banner -->
    <tr>
      <td style="background-color:#1a72c7;padding:10px 24px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#ffffff;font-weight:600;letter-spacing:0.04em;line-height:1.8;">
          Order over $100 qualifies for Free Shipping &nbsp;·&nbsp; Promotion: 10% off entire order &nbsp;·&nbsp; Promo Code: <strong>KD2024</strong>
        </p>
      </td>
    </tr>
 
    <!-- Body -->
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">
 
          <!-- Header card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:4px;padding:28px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#1a72c7;font-weight:700;">Order confirmed</p>
                    <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#1a1a1a;line-height:1.2;">Thanks for your order, ${order.recipient_name}!</p>
                    <p style="margin:0;font-size:12px;color:#888888;">A copy of this receipt was sent to <strong style="color:#1a1a1a;">${order.email}</strong></p>
                  </td>
                  <td align="right" valign="top">
                    <span style="display:inline-block;background-color:#e8f5e9;color:#2e7d32;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:0.05em;">&#10003; Paid</span>
                  </td>
                </tr>
              </table>
 
              <!-- Order meta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;border-radius:3px;margin-top:20px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="33%" style="vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999999;">Order #</p>
                          <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;">${order.id}</p>
                        </td>
                        <td width="33%" style="vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999999;">Date</p>
                          <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;">${order.created_at}</p>
                        </td>
                        <td width="33%" style="vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999999;">Est. Delivery</p>
                          <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;">${order.created_at * (5 * 24 * 60 * 60 * 1000)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <tr><td style="height:12px;"></td></tr>
 
          <!-- Order items card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:4px;padding:24px 32px;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#1a72c7;font-weight:700;padding-bottom:10px;border-bottom:2px solid #1a72c7;">Order summary</p>
 
              <!-- Items loop -->
              ${order.items
                .map(
                  (item, i) => `
              <table width="100%" cellpadding="0" cellspacing="0" style="${i < order.items.length - 1 ? "border-bottom:1px solid #f0f0f0;" : ""}padding-bottom:12px;margin-bottom:12px;">
                <tr>
                  <td style="padding:10px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="44" style="vertical-align:middle;">
                          <div style="width:44px;height:44px;background-color:#eeeeee;border-radius:3px;text-align:center;line-height:44px;font-size:22px;">👟</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#1a1a1a;">${item.brand} ${item.name}</p>
                          <p style="margin:0;font-size:11px;color:#999999;">Size US ${item.size} · ${item.colorway}</p>
                        </td>
                        <td align="right" style="vertical-align:middle;">
                          <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;">$${item.price.toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              `,
                )
                .join("")}
 
              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background-color:#eeeeee;padding:0;"></td></tr></table>
 
              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
                <tr>
                  <td style="padding:4px 0;font-size:12px;color:#888888;">Subtotal</td>
                  <td align="right" style="padding:4px 0;font-size:12px;color:#555555;">$${order.total_at_purchase.toFixed(2)}</td>
                </tr>
                ${
                  order.discount
                    ? `
                <tr>
                  <td style="padding:4px 0;font-size:12px;color:#888888;">Discount (${order.discountCode})</td>
                  <td align="right" style="padding:4px 0;font-size:12px;color:#2ecc40;font-weight:700;">−$${order.discount ? order.discount.toFixed(2) : 0.0}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="padding:4px 0;font-size:12px;color:#888888;">Shipping</td>
                  <td align="right" style="padding:4px 0;font-size:12px;color:#2ecc40;font-weight:700;">${order.shipping ? (order.shipping === 0 ? "Free" : "$" + order.shipping.toFixed(2)) : "Free"}</td>
                </tr>
                <tr>
                  <td style="padding-top:12px;border-top:1px solid #eeeeee;font-size:14px;font-weight:800;color:#1a1a1a;">Total</td>
                  <td align="right" style="padding-top:12px;border-top:1px solid #eeeeee;font-size:14px;font-weight:800;color:#1a72c7;">$${order.total_at_purchase.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>
 
          <tr><td style="height:12px;"></td></tr>
 
          <!-- Shipping card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:4px;padding:24px 32px;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#1a72c7;font-weight:700;padding-bottom:10px;border-bottom:2px solid #1a72c7;">Shipping to</p>
              <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#1a1a1a;">${order.recipient_name}</p>
              <p style="margin:0 0 20px;font-size:13px;color:#888888;line-height:1.7;">${order.ship_to.address_1}</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${order.trackingUrl || "#"}" style="display:inline-block;background-color:#2ecc40;color:#ffffff;font-size:13px;font-weight:700;padding:14px 36px;border-radius:3px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">Track Your Order</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
        </table>
      </td>
    </tr>
 
    <!-- Footer -->
    <tr>
      <td style="background-color:#222222;padding:20px 24px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#777777;letter-spacing:0.04em;line-height:1.8;">
          Questions? Contact our 24/7 support team at support@ikicks.com<br/>
          © ${new Date().getFullYear()} iKicks · All rights reserved
        </p>
      </td>
    </tr>
 
  </table>
</body>
</html>
`;

export const sendPasswordResetCode = async (code, email) => {
  const { data, error } = await resend.emails.send({
    from: "iKicks <onboarding@resend.dev>",
    to: [`${email}`],
    subject: "Your Temporary password reset code",
    html: resetPasswordHtml(code),
  });

  if (error) {
    console.error(error);
  }
  console.log(data);
};

export const sendOrderConfirmation = async (order, email) => {
  const { data, error } = await resend.emails.send({
    from: "iKicks <onboarding@resend.dev>",
    to: [`${email}`],
    subject: "Order Confirmation",
    html: OrderConfirmationHtml(order),
  });
};

export const sendRegistrationConfirmation = async (name, email) => {
  const { data, error } = await resend.emails.send({
    from: "iKicks <onboarding@resend.dev>",
    to: [`${email}`],
    subject: "Welcome to the iKicks family 👟",
    html: registrationHtml(name),
  });
};
