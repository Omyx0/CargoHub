"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, ArrowRight, Eye, EyeOff, Truck,
  Shield, Zap, ChevronLeft, User, Lock
} from "lucide-react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "../../lib/firebase";

export default function RegisterPage() {
  const [mode, setMode] = useState<"user" | "driver">("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (phone.length < 10 || name.length < 2 || password.length < 6) {
      alert("Please fill all fields correctly (Password min 6 chars, Phone 10 digits).");
      return;
    }
    setLoading(true);

    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Register user in PostgreSQL database
      const regRes = await fetch(`http://localhost:5000/api/auth/${mode === 'user' ? 'register-user' : 'register-driver'}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name,
          email,
          phone: '+91' + phone,
          role: mode === 'user' ? 'CUSTOMER' : 'DRIVER'
        })
      });
      
      const regData = await regRes.json();
      if (regData.success || regRes.ok) {
         window.location.href = mode === "user" ? "/book" : "/driver";
      } else {
         alert('Registration failed in database: ' + (regData.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const regRes = await fetch(`http://localhost:5000/api/auth/${mode === 'user' ? 'register-user' : 'register-driver'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: result.user.displayName || 'Unknown User',
          email: result.user.email,
          // Since Google doesn't always provide a phone number, use the one they typed, or a dummy if empty
          phone: phone.length === 10 ? '+91' + phone : (result.user.phoneNumber || '+910000000000')
        })
      });
      
      const regData = await regRes.json();
      if (regData.success || regRes.ok) {
        window.location.href = mode === "user" ? "/book" : "/driver";
      } else {
        alert('Database registration failed: ' + (regData.message || regData.error));
      }
    } catch (err: any) {
      alert("Google signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16" style={{
        background: "linear-gradient(135deg, rgba(2, 89, 221, 0.15), rgba(132, 175, 251, 0.1))",
        borderRight: "1px solid var(--border-subtle)",
      }}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
              🚛
            </div>
            <span className="font-display text-3xl font-bold">CargoHub</span>
          </div>

          <h2 className="text-4xl font-extrabold mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Join the logistics,<br />
            <span className="gradient-text">revolution.</span>
          </h2>

          <div className="space-y-5">
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Instant Setup", desc: "Get your account running in 2 minutes" },
              { icon: <Shield className="w-5 h-5" />, title: "Secure Platform", desc: "Enterprise-grade encryption and safety" },
              { icon: <Truck className="w-5 h-5" />, title: "Endless Opportunities", desc: "Connect with thousands of shipments daily" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(2, 89, 221, 0.15)", color: "var(--brand-primary-light)" }}>
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{f.title}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back to home */}
          <a href="/" className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            <ChevronLeft className="w-4 h-4" /> Back to home
          </a>

          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Create an account
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Sign up to start managing your logistics today.
          </p>

          {/* Role toggle */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "var(--bg-tertiary)" }}>
            {(["user", "driver"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setMode(r)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: mode === r ? "var(--brand-primary)" : "transparent",
                  color: mode === r ? "white" : "var(--text-muted)",
                }}
              >
                {r === "user" ? "👤 Customer" : "🚛 Driver"}
              </button>
            ))}
          </div>

          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Full Name</label>
            <div className="flex gap-2">
              <div className="input-field flex items-center justify-center" style={{ width: 50, textAlign: "center" }}>
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="input-field flex-1"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email Address</label>
            <div className="flex gap-2">
              <div className="input-field flex items-center justify-center" style={{ width: 50, textAlign: "center" }}>
                <Mail className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field flex-1"
              />
            </div>
          </div>

          {/* Phone input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Phone Number (Optional for Google Signup)</label>
            <div className="flex gap-2">
              <div className="input-field flex items-center justify-center" style={{ width: 70, textAlign: "center", fontSize: "14px" }}>
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit number"
                className="input-field flex-1"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
            <div className="flex gap-2 relative">
              <div className="input-field flex items-center justify-center" style={{ width: 50, textAlign: "center" }}>
                <Lock className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 6 chars)"
                className="input-field flex-1"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="btn-primary w-full mb-6"
            style={{ padding: "14px", opacity: phone.length === 10 && name.length > 2 && password.length >= 6 && !loading ? 1 : 0.5 }}
            disabled={phone.length !== 10 || name.length <= 2 || password.length < 6 || loading}
          >
            {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 divider" />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>OR</span>
            <div className="flex-1 divider" />
          </div>

          {/* Google sign-in */}
          <button 
            onClick={handleGoogleSignup}
            className="btn-secondary w-full" style={{ padding: "14px" }}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block mr-2"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign up with Google
          </button>

          {/* Login link */}
          <p className="text-sm text-center mt-8" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <a href="/login" className="font-semibold" style={{ color: "var(--brand-primary-light)" }}>
              Sign in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
