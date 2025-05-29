import React from "react";
import { Head, Preview, Html, Body, Button } from "@react-email/components";

const Template = () => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for registering</Preview>
      <Body style={body}>
        <div style={emailContainer}>
          <div style={emailCard}>
            <h1 style={centerText}>Kicks District</h1>
            <hr />
            <p style={centerText}>
              &#127878;Thank you for becoming a member of this amazing
              community&#127878;
            </p>
            <p style={centerText}>Here's a coupon code for your first order:</p>
            <div style={couponCodeContainer}>
              <p style={couponCode}>KDNEW2025</p>
            </div>
            <hr />
            <div style={shopContainer}>
              <p>Check out latest sneakers</p>
              <Button href="www.kicksdistrict.com" style={shopButton}>
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </Body>
    </Html>
  );
};

const body = {
  backgroundColor: "#116fc7",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  margin: 0,
  fontFamily: "'Roboto', sans-serif",
};

const emailContainer = {
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "600px",
  padding: "20px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
};

const emailCard = {
  border: "1px solid black",
  padding: "20px",
  width: "100%",
};

const centerText = {
  textAlign: "center",
};

const couponCodeContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "default",
};

const couponCode = {
  width: "250px",
  height: "40px",
  border: "2px solid black",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "18px",
  backgroundColor: "black",
  color: "white",
};

const shopContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
};

const shopButton = {
  padding: "10px 15px",
  backgroundColor: "#00c200",
  color: "white",
  borderRadius: "10px",
};

export default Template;
