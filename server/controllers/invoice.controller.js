import puppeteer from "puppeteer";

export const generateInvoice = async (req, res) => {
  const { email } = req.user;
  const {
    id,
    full_name,
    recipient_name,
    phone_number,
    shipping_cost,
    payment_method,
    total_at_purchase,
    items,
    ship_to,
    created_at,
  } = req.body;
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
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

  /* ===== HEADER ===== */
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

  .invoice-label {
    text-align: right;
  }

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

  /* ===== AMOUNT BANNER ===== */
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

  /* ===== BODY ===== */
  .invoice-body {
    padding: 36px 48px;
  }

  /* ===== ADDRESSES — 3 columns ===== */
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

  /* ===== ITEMS TABLE ===== */
  .items-section {
    margin-bottom: 32px;
  }

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

  .items-header span:not(:first-child) {
    text-align: right;
  }

  .order-item {
    display: grid;
    grid-template-columns: 1fr 60px 100px 100px;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }

  .order-item:last-child {
    border-bottom: 1.5px solid var(--black);
  }

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

  .mobile-label {
    display: none;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin-bottom: 2px;
  }

  /* ===== TOTALS ===== */
  .totals-section {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid var(--border);
  }

  .totals-table {
    width: 280px;
  }

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

  /* ===== PAYMENT INFO ===== */
  .payment-section {
    page-break-before: always;
    margin-bottom: 36px;
  }

  .payment-section h3 {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted);
    margin-bottom: 12px;
  }

  .payment-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    background: var(--light-gray);
    padding: 20px 24px;
  }

  .payment-item .p-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }

  .payment-item .p-value {
    font-size: 12px;
    color: var(--text);
    font-weight: 500;
  }

  /* ===== FOOTER ===== */
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

  .page-number {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    text-align: right;
    padding: 12px 48px;
    border-top: 1px solid var(--border);
  }

  /* ===========================
     MEDIA QUERIES
  =========================== */

  @media (max-width: 768px) {
    body { padding: 24px 16px; }

    .invoice-header { padding: 28px 32px 24px; }
    .brand-name { font-size: 34px; }
    .invoice-label h1 { font-size: 34px; }
    .amount-banner { padding: 16px 32px; }
    .amount-due { font-size: 18px; }
    .invoice-body { padding: 28px 32px; }

    /* 3 columns → 2 columns on tablet */
    .addresses {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    /* Ship To drops to full width below */
    .addresses .address-block:last-child {
      grid-column: 1 / -1;
      border-top: 1px solid var(--border);
      padding-top: 20px;
    }

    .items-header { display: none; }

    .order-item {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      background: var(--light-gray);
      margin-bottom: 8px;
      border-bottom: none;
    }

    .order-item:last-child { border-bottom: none; }
    .mobile-label { display: block; }

    .order-item span {
      justify-content: flex-start;
      font-size: 13px;
    }

    .totals-section { justify-content: stretch; }
    .totals-table { width: 100%; }

    .payment-grid { grid-template-columns: 1fr 1fr; }

    .invoice-footer {
      padding: 20px 32px;
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }

    .page-number { padding: 12px 32px; }
  }

  @media (max-width: 480px) {
    body { padding: 16px 12px; }

    .print-bar { margin-bottom: 8px; }
    .btn-print { font-size: 10px; padding: 8px 14px; }

    .invoice-header {
      padding: 20px 20px 18px;
      flex-direction: column;
      gap: 16px;
    }

    .brand-name { font-size: 28px; }
    .invoice-label { text-align: left; }
    .invoice-label h1 { font-size: 28px; }
    .invoice-meta { align-items: flex-start; }

    .amount-banner {
      padding: 14px 20px;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .amount-due { font-size: 20px; }
    .invoice-body { padding: 20px; }

    /* All 3 columns stack on mobile */
    .addresses {
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 24px;
      padding-bottom: 24px;
    }

    .addresses .address-block:last-child {
      grid-column: auto;
      border-top: 1px solid var(--border);
      padding-top: 20px;
    }

    .order-item { padding: 14px; }

    .payment-grid {
      grid-template-columns: 1fr;
      gap: 14px;
      padding: 16px;
    }

    .invoice-footer { padding: 16px 20px; }
    .page-number { padding: 10px 20px; }
  }
</style>
</head>
<body>

<div class="print-bar no-print">
  <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
</div>

<div class="invoice-wrapper">
  <!-- HEADER -->
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
        <span>Invoice number <strong>${id}</strong></span>
        <span>Date of issue <strong>${created_at}</strong></span>
      </div>
    </div>
  </div>

  <!-- AMOUNT BANNER -->
  <div class="amount-banner">
    <div>
      <div class="amount-label">Amount paid</div>
      <div class="amount-due">$${total_at_purchase} USD</div>
    </div>
    <div class="paid-badge">✓ &nbsp;Paid</div>
  </div>

  <!-- BODY -->
  <div class="invoice-body">

    <!-- FROM | BILL TO | SHIP TO — 3 columns -->
    <div class="addresses">
      <div class="address-block">
        <h3>From</h3>
        <p class="name">iKicks</p>
        <p>support@ikicks.com<br>ikicks.com</p>
      </div>

      <div class="address-block">
        <h3>Bill To</h3>
        <p class="name">${full_name}</p>
        <p>
          ${email}<br>
          ${ship_to.address_1}<br>
          ${ship_to.city}, ${ship_to.state} ${ship_to.zipcode}
        </p>
      </div>

      <div class="address-block">
        <h3>Ship To</h3>
        <p class="name">${recipient_name}</p>
        <p>
          ${ship_to.address_1}<br>
          ${ship_to.city}, ${ship_to.state} ${ship_to.zipcode}<br>
          ${phone_number}
        </p>
      </div>
    </div>

    <!-- ITEMS -->
    <div class="items-section">
      <div class="items-header">
        <span>Description</span>
        <span>Qty</span>
        <span>Unit Price</span>
        <span>Amount</span>
      </div>

      ${items
        .map(
          (item) => `
        <div class="order-item">
          <div class="item-details">
            <span class="item-name">${item.name}</span>
            <span class="item-meta">${item.brand} · Size ${item.size} · ${item.colorway}</span>
          </div>
          <span>
            ${item.quantity}
          </span>
          <span>
            $${item.price_at_purchase}
          </span>
          <span>
            $${(item.price_at_purchase * item.quantity).toFixed(2)}
          </span>
        </div>
      `,
        )
        .join("")}
    </div>

    <!-- TOTALS -->
    <div class="totals-section">
      <div class="totals-table">
        <div class="totals-row">
          <span class="label">Subtotal</span>
          <span class="value">$${total_at_purchase}</span>
        </div>
        <div class="totals-row">
          <span class="label">Shipping</span>
          <span class="value">${shipping_cost}</span>
        </div>
        <div class="totals-row">
          <span class="label">Tax (10%)</span>
          <span class="value">$${(total_at_purchase * 0.1).toFixed(2)}</span>
        </div>
        <div class="totals-row total-due">
          <span class="label">Total</span>
          <span class="value">$${(total_at_purchase * 1.1).toFixed(2)} USD</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`,
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
    await browser.close();
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({ message: "Internal server error" });
  }
};
