import React from "react";

const CancellationRefundPolicy = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      userSelect: "none", /* Disable text selection */
      WebkitUserSelect: "none", /* Safari */
      MozUserSelect: "none", /* Firefox */
      msUserSelect: "none", /* IE10+ */
    }}
  >
    <div
      style={{
        padding: "2.5rem 1.5rem",
        maxWidth: 900,
        fontFamily: "'Inter', sans-serif",
        color: "#4a3c2f",
        backgroundColor: "#fffbf1",
        borderRadius: 18,
        boxShadow: "0 6px 28px rgba(216, 137, 38, 0.12)",
        lineHeight: 1.7,
      }}
    >
      <h1
        style={{
          fontSize: "2.8rem",
          color: "#d97706",
          marginBottom: "0.3rem",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Cancellation & Refund Policy
      </h1>
      <p
        style={{
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "#b45309",
          marginBottom: "2rem",
        }}
      >
        Last updated on 15-11-2025 19:50:00
      </p>

      <p style={{ marginBottom: "1.8rem" }}>
        THE BLACK CREST believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
      </p>

      <ul style={{ marginBottom: "1.6rem" }}>
        <li>
          Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
        </li>
        <li>
          THE BLACK CREST does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
        </li>
        <li>
          In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within Only same day days of receipt of the products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within Only same day days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
        </li>
        <li>
          In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them. In case of any Refunds approved by the THE BLACK CREST, it’ll take 3-5 Days days for the refund to be processed to the end customer.
        </li>
      </ul>
    </div>
  </div>
);

export default CancellationRefundPolicy;
