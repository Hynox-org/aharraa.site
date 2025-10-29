import React from "react";

// Example Unsplash food background image
const foodBg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80";

const TermsAndConditions = () => (
  <div
    style={{
      minHeight: "100vh",
      background: `linear-gradient(to bottom right, #fff7e6 80%, #ffd8b0 100%), url('${foodBg}') center/cover no-repeat`,
      padding: "10px"
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(4px)",
        maxWidth: 750,
        margin: "3rem auto",
        borderRadius: 24,
        boxShadow: "0 8px 32px 0 rgba(191,140,44,0.1)",
        padding: "2.5rem 2rem",
      }}
    >
      <h1 style={{
        fontSize: "2.7rem", fontWeight: 700, marginBottom: "0.25rem", color: "#d97706", letterSpacing: 1 }}
      >Terms & Conditions</h1>
      <p style={{ color: "#a16207", marginBottom: "2rem" }}>
        <strong>Last updated:</strong> October 29, 2025
      </p>
      <p>
        Welcome to <span style={{ fontWeight: 600, color: "#be123c" }}>aharraa.com</span>. By accessing or using our website and services, you agree to the following terms and conditions:
      </p>

      <h2 style={{ marginTop: "2rem", color: "#c2410c" }}>Use of Website</h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>You must be at least 18 years old or have legal parental consent to use aharraa.com.</li>
        <li>You agree to use our website lawfully and not for any prohibited activities.</li>
      </ul>

      <h2 style={{ color: "#c2410c" }}>Account and Security</h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>Notify us immediately if you suspect unauthorized use of your account.</li>
      </ul>

      <h2 style={{ color: "#c2410c" }}>Orders and Payments</h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>All prices are listed in INR unless otherwise stated.</li>
        <li>Orders are subject to availability and confirmation.</li>
        <li>Payments are processed securely; we do not store your payment details.</li>
      </ul>

      <h2 style={{ color: "#c2410c" }}>Intellectual Property</h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>
          All content on aharraa.com, including text, images, logos, and code, is our property or licensed to us. Do not copy, modify, or use without permission.
        </li>
      </ul>

      <h2 style={{ color: "#c2410c" }}>Limitation of Liability</h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>
          We are not liable for indirect, incidental, or consequential damages arising from your use of our website or services.
        </li>
        <li>
          While we strive for accuracy, we do not guarantee that information on the website is current or error-free.
        </li>
      </ul>

      <h2 style={{ color: "#c2410c" }}>Termination</h2>
      <ul style={{ marginBottom: "1.6rem" }}>
        <li>We may suspend or terminate accounts for violations of these terms or misuse of our platform.</li>
      </ul>

      <h2 style={{ color: "#c2410c" }}>Governing Law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2 style={{ color: "#c2410c" }}>Changes to Terms</h2>
      <p>We reserve the right to change these terms at any time, with updates effective upon posting.</p>

      <h2 style={{ color: "#c2410c" }}>Contact Information</h2>
      <p>
        If you have questions about our terms, contact us at:{" "}
        <a style={{ color: "#b91c1c", textDecoration: "underline" }} href="mailto:info.aharraa@gmail.com">
          info.aharraa@gmail.com
        </a>
      </p>
    </div>
  </div>
);

export default TermsAndConditions;
