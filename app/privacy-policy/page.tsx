import React from "react";

const PrivacyPolicy = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
    }}
  >
    <div
      style={{
        padding: "2.5rem 1.5rem",
        maxWidth: 900,
        fontFamily: "'Inter', sans-serif",
        color: "#1f2937",
        backgroundColor: "#ffffff",
        borderRadius: 18,
        boxShadow: "0 6px 28px rgba(60, 179, 113, 0.12)",
        border: "1px solid #e5e7eb",
        lineHeight: 1.7,
      }}
    >
      <h1
        style={{
          fontSize: "2.8rem",
          color: "#000000",
          marginBottom: "0.3rem",
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        Privacy Policy
      </h1>
      <p
        style={{
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "#3CB371",
          marginBottom: "2rem",
        }}
      >
        Last updated: October 29, 2025
      </p>

      <p style={{ marginBottom: "1.8rem", color: "#374151" }}>
        Welcome to <strong style={{ color: "#3CB371" }}>aharraa.com</strong>{" "}
        ("we", "our", "us"). Your privacy is important to us. This privacy
        policy explains how we collect, use, store, and protect your personal
        information when you use our website and services.
      </p>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>
        Information We Collect
      </h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>
          Personal data such as name, email address, phone number, and address,
          provided when you register or purchase.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          Payment information, collected and processed securely by third-party
          payment gateways.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          Usage data, including IP address, browser type, device information,
          and interaction patterns on our website.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          Cookies and similar technologies for analytics, personalization, and
          security.
        </li>
      </ul>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>
        How We Use Your Information
      </h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>To provide, operate, and maintain our website and services.</li>
        <li style={{ marginBottom: "0.8rem" }}>To improve and personalize user experience.</li>
        <li style={{ marginBottom: "0.8rem" }}>
          For processing orders, transactions, and providing customer support.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          To communicate updates, offers, and promotions (you can opt out
          anytime).
        </li>
        <li style={{ marginBottom: "0.8rem" }}>To comply with legal and regulatory obligations.</li>
      </ul>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>
        Information Sharing
      </h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>We do not sell or lease your personal data.</li>
        <li style={{ marginBottom: "0.8rem" }}>
          Data may be shared with trusted partners for business operations (such
          as hosting, analytics, and payment processing), under strict
          confidentiality agreements.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          We may share information if required by law, legal process, or to
          protect our rights and users.
        </li>
      </ul>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>
        Data Security and Retention
      </h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>
          Your data is stored securely with industry-standard technical and
          organizational measures.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          We retain your information only as long as necessary for the purposes
          stated above.
        </li>
      </ul>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>
        Data Subject Rights
      </h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>Access or correct your personal information.</li>
        <li style={{ marginBottom: "0.8rem" }}>
          Request deletion of your account and data, subject to lawful retention
          requirements.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>Withdraw consent for non-essential data processing.</li>
      </ul>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>
        Children's Privacy
      </h2>
      <p style={{ marginBottom: "1.6rem", color: "#374151" }}>
        Our services are not directed at children under 13. We do not knowingly
        collect data from children.
      </p>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>
        Changes to This Policy
      </h2>
      <p style={{ marginBottom: "1.8rem", color: "#374151" }}>
        We may update our privacy policy from time to time. Changes will be
        posted on this page with the effective date.
      </p>

      <h2 style={{ color: "#000000", marginBottom: "0.9rem", fontSize: "1.75rem", fontWeight: 600 }}>Contact Us</h2>
      <p style={{ color: "#374151" }}>
        For questions about this Privacy Policy, contact us at:{" "}
        <a
          href="mailto:info.aharraa@gmail.com"
          style={{
            color: "#3CB371",
            fontWeight: "600",
            textDecoration: "underline",
          }}
        >
          info.aharraa@gmail.com
        </a>
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;
