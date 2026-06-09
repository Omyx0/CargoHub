const http = require('http');

async function testAuth() {
  console.log("1. Sending OTP...");
  const sendRes = await fetch('http://localhost:5000/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919424316742' })
  });
  const sendData = await sendRes.json();
  console.log("Send OTP Response:", sendData);
  console.log("Check your phone! An SMS should have arrived from MSG91.");
}

testAuth();
