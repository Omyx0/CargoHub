import Razorpay from 'razorpay';
import { v2 as cloudinary } from 'cloudinary';
import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';
import * as Sentry from '@sentry/node';
import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';
import { LogSnag } from '@logsnag/node';
import axios from 'axios';

// ── Razorpay ───────────────────────────────────────────────────────────────
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// ── Cloudinary ─────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export { cloudinary };

// ── Resend ─────────────────────────────────────────────────────────────────
export const resend = new Resend(process.env.RESEND_API_KEY || '');

// ── Gemini AI ──────────────────────────────────────────────────────────────
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// ── LogSnag ────────────────────────────────────────────────────────────────
export const logsnag = new LogSnag({
  token: process.env.LOGSNAG_TOKEN || '',
  project: process.env.LOGSNAG_PROJECT || 'cargo-hub',
});

// ── Arcjet ─────────────────────────────────────────────────────────────────
export const aj = arcjet({
  key: process.env.ARCJET_KEY || '', // Get your site key from https://app.arcjet.com
  characteristics: ['ip.src'], // Track requests by IP
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: 'LIVE' }),
    // Create a bot detection rule
    detectBot({
      mode: 'LIVE', 
      // Block all automated clients
      allow: [],
    }),
    // Create a rate limit rule
    slidingWindow({
      mode: 'LIVE',
      interval: '1m', 
      max: 100, 
    }),
  ],
});

// ── Sentry ─────────────────────────────────────────────────────────────────
export const initSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV || 'development',
    });
  }
};

// ── MSG91 ──────────────────────────────────────────────────────────────────
export const sendSMS = async (phone: string, templateId: string, params: Record<string, string>) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  if (!authKey) throw new Error('MSG91_AUTH_KEY is missing');
  
  // We are stripping the + sign since MSG91 typically takes country code without +
  const mobiles = phone.replace('+', '');
  
  try {
    const response = await axios.post('https://control.msg91.com/api/v5/flow/', {
      template_id: templateId,
      short_url: '1',
      recipients: [
        {
          mobiles,
          ...params
        }
      ]
    }, {
      headers: {
        'authkey': authKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.type === 'error') {
      throw new Error(response.data.message || 'MSG91 API returned an error');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('MSG91 Delivery Error:', error?.response?.data || error.message);
    throw error; // Throw so the caller knows it failed
  }
};
