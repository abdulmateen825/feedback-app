import * as React from "react";

type OtpEmailProps = {
  userName: string;
  otp: string;
};

export const OtpEmail = ({ userName, otp }: OtpEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#333" }}>Email Verification</h2>

        <p style={{ fontSize: "16px", color: "#555" }}>
          Hi {userName},
        </p>

        <p style={{ fontSize: "16px", color: "#555" }}>
          Use the verification code below to complete your process:
        </p>

        <div
          style={{
            margin: "20px 0",
            padding: "15px 25px",
            fontSize: "28px",
            letterSpacing: "6px",
            fontWeight: "bold",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          {otp}
        </div>

        <p style={{ fontSize: "14px", color: "#888" }}>
          This code will expire in 10 minutes.
        </p>

        <p style={{ fontSize: "14px", color: "#888" }}>
          If you did not request this, you can ignore this email.
        </p>
      </div>
    </div>
  );
};