"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface RouteGuardLoginProps {
  title: string;
  subtitle: string;
  demoEmail: string;
  demoPass: string;
  onLogin: (email: string, pass: string) => void;
}

export default function RouteGuardLogin({ title, subtitle, demoEmail, demoPass, onLogin }: RouteGuardLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <motion.div
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/" className="flex items-center gap-2 text-sm mb-8 hover:text-gray-900 transition-colors" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-4 h-4" /> Back to home
        </Link>

        <h1 className="font-display text-3xl font-bold mb-2 text-gray-900">
          {title}
        </h1>
        <p className="text-sm mb-6 text-gray-500">
          {subtitle}
        </p>

        {/* Demo Credentials Alert */}
        <div className="mb-8 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">Demo Credentials</p>
          <div className="flex justify-between items-center text-sm font-mono text-blue-900">
            <span>{demoEmail}</span>
            <span>{demoPass}</span>
          </div>
        </div>

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-600">Email Address</label>
          <div className="flex gap-2">
            <div className="input-field flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl" style={{ width: 50, textAlign: "center" }}>
              <Mail className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="mb-8 relative">
          <label className="block text-sm font-medium mb-2 text-gray-600">Password</label>
          <div className="flex gap-2 relative">
            <div className="input-field flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl" style={{ width: 50, textAlign: "center" }}>
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          style={{ background: "var(--brand-primary)", opacity: (!email || !password) ? 0.5 : 1 }}
          disabled={!email || !password}
        >
          Sign In <ArrowRight className="w-5 h-5" />
        </button>

      </motion.div>
    </div>
  );
}
