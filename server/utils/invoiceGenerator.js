import puppeteer from "puppeteer";

export const generateInvoice = async (email, orderData) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(
      `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>iKicks — Invoice</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
  :root {
    --black: #0a0a0a;
    --white: #ffffff;
    --border: #e8e8e8;
    --muted: #888888;
    --text: #111111;
    --light-gray: #f5f5f5;
  }
 
  @media print {
    body { background: white; padding: 0; }
    .no-print { display: none !important; }
    .invoice-wrapper { box-shadow: none; max-width: 100%; }
  }
 
  body {
    background: #f0f0f0;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    color: var(--text);
  }
 
  .print-bar {
    width: 100%;
    max-width: 780px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
 
  .btn-print {
    padding: 9px 20px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    border: 1.5px solid var(--black);
    background: var(--black);
    color: var(--white);
    transition: all 0.15s;
  }
 
  .btn-print:hover {
    background: var(--white);
    color: var(--black);
  }
 
  .invoice-wrapper {
    width: 100%;
    max-width: 780px;
    background: var(--white);
    box-shadow: 0 2px 24px rgba(0,0,0,0.08);
  }
 
  .invoice-header {
    padding: 40px 48px 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid var(--black);
  }
 
  .brand-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 42px;
    color: var(--black);
    letter-spacing: 0.05em;
    line-height: 1;
  }
 
  .brand-address {
    margin-top: 8px;
    font-size: 12px;
    color: var(--muted);
    line-height: 1.7;
  }
 
  .invoice-label { text-align: right; }
 
  .invoice-label h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 42px;
    color: var(--black);
    letter-spacing: 0.08em;
    line-height: 1;
  }
 
  .invoice-meta {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: flex-end;
  }
 
  .invoice-meta span {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
  }
 
  .invoice-meta span strong {
    color: var(--text);
    font-weight: 500;
  }
 
  .amount-banner {
    padding: 20px 48px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
 
  .amount-due {
    font-family: 'DM Mono', monospace;
    font-size: 22px;
    font-weight: 500;
    color: var(--text);
  }
 
  .amount-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 3px;
  }
 
  .paid-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1.5px solid var(--black);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: var(--black);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    background: var(--light-gray);
  }
 
  .invoice-body { padding: 36px 48px; }
 
  .addresses {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
    margin-bottom: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid var(--border);
  }
 
  .address-block h3 {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted);
    margin-bottom: 10px;
  }
 
  .address-block .name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 4px;
  }
 
  .address-block p {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.8;
  }
 
  .items-section { margin-bottom: 32px; }
 
  .items-header {
    display: grid;
    grid-template-columns: 1fr 60px 100px 100px;
    gap: 16px;
    padding: 8px 0;
    border-top: 1.5px solid var(--black);
    border-bottom: 1.5px solid var(--black);
  }
 
  .items-header span {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--muted);
  }
 
  .items-header span:not(:first-child) { text-align: right; }
 
  .order-item {
    display: grid;
    grid-template-columns: 1fr 60px 100px 100px;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
 
  .order-item:last-child { border-bottom: 1.5px solid var(--black); }
 
  .item-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
 
  .item-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }
 
  .item-meta {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
  }
 
  .order-item span {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
 
  .totals-section {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid var(--border);
  }
 
  .totals-table { width: 280px; }
 
  .totals-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid var(--border);
  }
 
  .totals-row:last-child {
    border-bottom: none;
    padding-top: 12px;
    margin-top: 4px;
  }
 
  .totals-row .label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
 
  .totals-row .value {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text);
  }
 
  .totals-row.total-due .label {
    font-size: 11px;
    color: var(--text);
    font-weight: 500;
  }
 
  .totals-row.total-due .value {
    font-size: 16px;
    font-weight: 500;
    color: var(--black);
  }
 
  .invoice-footer {
    border-top: 2px solid var(--black);
    padding: 24px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
 
  .footer-note {
    font-size: 11px;
    color: var(--muted);
    line-height: 1.7;
  }
 
  .footer-note a {
    color: var(--text);
    text-decoration: underline;
  }
 
  .footer-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: var(--black);
    letter-spacing: 0.05em;
  }
</style>
</head>
<body>
 
<div class="invoice-wrapper">
  <div class="invoice-header">
    <div>
      <div class="brand-name">iKicks</div>
      <div class="brand-address">
        support@ikicks.com<br>
        ikicks.com
      </div>
    </div>
    <div class="invoice-label">
      <h1>Invoice</h1>
      <div class="invoice-meta">
        <span>Invoice number <strong>${orderData.id}</strong></span>
        <span>Date of issue <strong>${orderData.created_at}</strong></span>
      </div>
    </div>
  </div>
 
  <div class="amount-banner">
    <div>
      <div class="amount-label">Amount paid</div>
      <div class="amount-due">$${orderData.total_at_purchase} USD</div>
    </div>
    <div class="paid-badge">✓ &nbsp;Paid</div>
  </div>
 
  <div class="invoice-body">
    <div class="addresses">
      <div class="address-block">
        <h3>From</h3>
        <p class="name">iKicks</p>
        <p>support@ikicks.com<br>ikicks.com</p>
      </div>
 
      <div class="address-block">
        <h3>Bill To</h3>
        <p class="name">${orderData.full_name}</p>
        <p>
          ${email}<br>
          ${orderData.ship_to.address_1}<br>
          ${orderData.ship_to.city}, ${orderData.ship_to.state} ${orderData.ship_to.zipcode}
        </p>
      </div>
 
      <div class="address-block">
        <h3>Ship To</h3>
        <p class="name">${orderData.recipient_name}</p>
        <p>
          ${orderData.ship_to.address_1}<br>
          ${orderData.ship_to.city}, ${orderData.ship_to.state} ${orderData.ship_to.zipcode}<br>
          ${orderData.phone_number}
        </p>
      </div>
    </div>
 
    <div class="items-section">
      <div class="items-header">
        <span>Description</span>
        <span>Qty</span>
        <span>Unit Price</span>
        <span>Amount</span>
      </div>
 
      ${orderData.items
        .map(
          (item) => `
        <div class="order-item">
          <div class="item-details">
            <span class="item-name">${item.name}</span>
            <span class="item-meta">${item.brand} · Size ${item.size} · ${item.colorway}</span>
          </div>
          <span>${item.quantity}</span>
          <span>$${item.price_at_purchase}</span>
          <span>$${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
        </div>
      `,
        )
        .join("")}
    </div>
 
    <div class="totals-section">
      <div class="totals-table">
        <div class="totals-row">
          <span class="label">Subtotal</span>
          <span class="value">$${orderData.total_at_purchase}</span>
        </div>
        <div class="totals-row">
          <span class="label">Shipping</span>
          <span class="value">$4.99</span>
        </div>
        <div class="totals-row">
          <span class="label">Tax (10%)</span>
          <span class="value">$${(orderData.total_at_purchase * 0.1).toFixed(2)}</span>
        </div>
        <div class="totals-row total-due">
          <span class="label">Total</span>
          <span class="value">$${(orderData.total_at_purchase * 1.1).toFixed(2)} USD</span>
        </div>
      </div>
    </div>
  </div>
 
  <div class="invoice-footer">
    <p class="footer-note">
      Thank you for your order.<br>
      Questions? <a href="mailto:support@ikicks.com">support@ikicks.com</a>
    </p>
    <div class="footer-brand">iKicks</div>
  </div>
</div>
 
</body>
</html>`,
      { waitUntil: "networkidle0" },
    );

    const pdf = await page.pdf({
      format: "A4",
      displayHeaderFooter: true,
      footerTemplate: `
        <div style="font-size:10px; font-family: monospace; width:100%; text-align:right; padding-right:48px; color:#888;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      margin: { bottom: "40px" },
    });

    // Returns a Buffer — caller converts to base64 for queue serialization:
    // pdf.toString("base64")
    return pdf;
  } finally {
    // Guaranteed to close even if page.setContent or page.pdf throws,
    // preventing Puppeteer processes from accumulating in memory.
    await browser.close();
  }
};
