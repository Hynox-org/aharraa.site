import React from "react";

const PrivacyPolicy = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
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
        Privacy Policy
      </h1>
      <p
        style={{
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "#b45309",
          marginBottom: "2rem",
        }}
      >
        Last updated: October 29, 2025
      </p>

      <p style={{ marginBottom: "1.8rem" }}>
        Welcome to <strong style={{ color: "#b45309" }}>aharraa.com</strong>{" "}
        (“we”, “our”, “us”). Your privacy is important to us. This privacy
        policy explains how we collect, use, store, and protect your personal
        information when you use our website and services.
      </p>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>
        Information We Collect
      </h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>
          Personal data such as name, email address, phone number, and address,
          provided when you register or purchase.
        </li>
        <li>
          Payment information, collected and processed securely by third-party
          payment gateways.
        </li>
        <li>
          Usage data, including IP address, browser type, device information,
          and interaction patterns on our website.
        </li>
        <li>
          Cookies and similar technologies for analytics, personalization, and
          security.
        </li>
      </ul>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>
        How We Use Your Information
      </h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>To provide, operate, and maintain our website and services.</li>
        <li>To improve and personalize user experience.</li>
        <li>
          For processing orders, transactions, and providing customer support.
        </li>
        <li>
          To communicate updates, offers, and promotions (you can opt out
          anytime).
        </li>
        <li>To comply with legal and regulatory obligations.</li>
      </ul>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>
        Information Sharing
      </h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>We do not sell or lease your personal data.</li>
        <li>
          Data may be shared with trusted partners for business operations (such
          as hosting, analytics, and payment processing), under strict
          confidentiality agreements.
        </li>
        <li>
          We may share information if required by law, legal process, or to
          protect our rights and users.
        </li>
      </ul>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>
        Data Security and Retention
      </h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>
          Your data is stored securely with industry-standard technical and
          organizational measures.
        </li>
        <li>
          We retain your information only as long as necessary for the purposes
          stated above.
        </li>
      </ul>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>
        Data Subject Rights
      </h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>Access or correct your personal information.</li>
        <li>
          Request deletion of your account and data, subject to lawful retention
          requirements.
        </li>
        <li>Withdraw consent for non-essential data processing.</li>
      </ul>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>
        Children’s Privacy
      </h2>
      <p style={{ marginBottom: "1.6rem" }}>
        Our services are not directed at children under 13. We do not knowingly
        collect data from children.
      </p>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>
        Changes to This Policy
      </h2>
      <p style={{ marginBottom: "1.8rem" }}>
        We may update our privacy policy from time to time. Changes will be
        posted on this page with the effective date.
      </p>

      <h2 style={{ color: "#c2410c", marginBottom: "0.9rem" }}>Contact Us</h2>
      <p>
        For questions about this Privacy Policy, contact us at:{" "}
        <a
          href="mailto:info.aharraa@gmail.com"
          style={{
            color: "#c2410c",
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
