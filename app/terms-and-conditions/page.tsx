import React from "react";

// Example Unsplash food background image
const foodBg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80";

const TermsAndConditions = () => (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      padding: "10px"
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(4px)",
        maxWidth: 750,
        margin: "3rem auto",
        borderRadius: 24,
        boxShadow: "0 8px 32px 0 rgba(60, 179, 113, 0.15)",
        border: "1px solid #e5e7eb",
        padding: "2.5rem 2rem",
      }}
    >
      <h1 style={{
        fontSize: "2.7rem", fontWeight: 700, marginBottom: "0.25rem", color: "#000000", letterSpacing: 0.5 }}
      >Terms & Conditions</h1>
      <p style={{ color: "#3CB371", marginBottom: "2rem", fontWeight: 600 }}>
        <strong>Last updated:</strong> October 29, 2025
      </p>
      <p style={{ color: "#374151", marginBottom: "1.5rem" }}>
        Welcome to <span style={{ fontWeight: 600, color: "#3CB371" }}>aharraa.com</span>. By accessing or using our website and services, you agree to the following terms and conditions:
      </p>

      <h2 style={{ marginTop: "2rem", color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Use of Website</h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>You must be at least 18 years old or have legal parental consent to use aharraa.com.</li>
        <li style={{ marginBottom: "0.8rem" }}>You agree to use our website lawfully and not for any prohibited activities.</li>
      </ul>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Account and Security</h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li style={{ marginBottom: "0.8rem" }}>Notify us immediately if you suspect unauthorized use of your account.</li>
      </ul>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Orders and Payments</h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>All prices are listed in INR unless otherwise stated.</li>
        <li style={{ marginBottom: "0.8rem" }}>Orders are subject to availability and confirmation.</li>
        <li style={{ marginBottom: "0.8rem" }}>Payments are processed securely; we do not store your payment details.</li>
      </ul>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Intellectual Property</h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>
          All content on aharraa.com, including text, images, logos, and code, is our property or licensed to us. Do not copy, modify, or use without permission.
        </li>
      </ul>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Limitation of Liability</h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>
          We are not liable for indirect, incidental, or consequential damages arising from your use of our website or services.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          While we strive for accuracy, we do not guarantee that information on the website is current or error-free.
        </li>
      </ul>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Termination</h2>
      <ul style={{ marginBottom: "1.6rem", paddingLeft: "1.5rem", color: "#374151" }}>
        <li style={{ marginBottom: "0.8rem" }}>We may suspend or terminate accounts for violations of these terms or misuse of our platform.</li>
      </ul>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Governing Law</h2>
      <p style={{ color: "#374151", marginBottom: "1.6rem" }}>These terms are governed by the laws of India.</p>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Changes to Terms</h2>
      <p style={{ color: "#374151", marginBottom: "1.6rem" }}>We reserve the right to change these terms at any time, with updates effective upon posting.</p>

      <h2 style={{ color: "#000000", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Contact Information</h2>
      <p style={{ color: "#374151" }}>
        If you have questions about our terms, contact us at:{" "}
        <a style={{ color: "#3CB371", textDecoration: "underline", fontWeight: 600 }} href="mailto:info.aharraa@gmail.com">
          info.aharraa@gmail.com
        </a>
      </p>
    </div>
  </div>
);

export default TermsAndConditions;
