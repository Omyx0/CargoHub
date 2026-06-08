"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Truck, MapPin, Power, IndianRupee, Star, Clock,
  Package, ArrowRight, ChevronLeft, Navigation,
  CheckCircle2, AlertTriangle, Upload, FileText,
  TrendingUp, Calendar, Activity,
} from "lucide-react";

const mockEarnings = {
  today: 2450,
  thisWeek: 14800,
  thisMonth: 52300,
  tripCount: 8,
};

const recentTrips = [
  { id: "FA-K8X7YT", pickup: "Hazratganj", drop: "Gomti Nagar", fare: 847, status: "DELIVERED", time: "2:30 PM" },
  { id: "FA-L9M2AB", pickup: "Alambagh", drop: "Chinhat", fare: 1523, status: "DELIVERED", time: "11:15 AM" },
  { id: "FA-N3P5CD", pickup: "Charbagh", drop: "Aliganj", fare: 623, status: "DELIVERED", time: "9:40 AM" },
];

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "earnings" | "kyc">("dashboard");

  return (
    <div className="min-h-screen bg-mesh bg-grid" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="container-wide flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:shadow-sm transition-all">
              <ChevronLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-gray-800">Driver Portal</span>
              <span className={`badge ml-3 font-semibold ${isOnline ? "badge-delivered" : "badge-cancelled"}`} style={{ fontSize: "9px" }}>
                <Activity className="w-3 h-3" /> {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Online toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all tracking-wider uppercase"
            style={{
              background: isOnline ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
              color: isOnline ? "var(--brand-success)" : "var(--brand-danger)",
              border: `1px solid ${isOnline ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)"}`,
            }}
          >
            <Power className="w-3.5 h-3.5" />
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="container-wide py-6">
        <div className="flex gap-2 p-1.5 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md">
          {(["dashboard", "earnings", "kyc"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 rounded-xl text-xs font-bold transition-all capitalize tracking-wider"
              style={{
                background: activeTab === tab ? "rgba(2, 89, 221, 0.08)" : "transparent",
                color: activeTab === tab ? "var(--brand-primary)" : "var(--text-secondary)",
                border: activeTab === tab ? "1px solid rgba(2, 89, 221, 0.12)" : "1px solid transparent",
              }}
            >
              {tab === "kyc" ? "KYC Status" : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="container-wide pb-12">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Driver profile card */}
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
                  SK
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-gray-800" style={{ color: "var(--text-primary)" }}>Suresh Kumar</h2>
                  <p className="text-sm font-semibold text-gray-400 mt-0.5">Tata Ace · UP32AB1234</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-800">4.7</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm font-semibold text-gray-500">156 trips</span>
                    <span className="badge badge-delivered font-semibold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Today's Earnings", value: `₹${mockEarnings.today.toLocaleString()}`, icon: <IndianRupee className="w-5 h-5" />, color: "var(--brand-success)" },
                { label: "Trips Today", value: mockEarnings.tripCount.toString(), icon: <Truck className="w-5 h-5" />, color: "var(--brand-primary)" },
                { label: "This Week", value: `₹${mockEarnings.thisWeek.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: "var(--brand-secondary)" },
                { label: "This Month", value: `₹${mockEarnings.thisMonth.toLocaleString()}`, icon: <Calendar className="w-5 h-5" />, color: "var(--brand-accent)" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</span>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${stat.color}08`, color: stat.color, border: `1px solid ${stat.color}15` }}>
                      {stat.icon}
                    </div>
                  </div>
                  <span className="text-2xl font-mono font-bold tracking-tight text-gray-800">{stat.value}</span>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>Your Location</h3>
              <div className="rounded-2xl border border-gray-150/60 overflow-hidden h-64 flex items-center justify-center bg-white/40 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0259dd_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                <div className="text-center z-10">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Navigation className="w-6 h-6 animate-pulse text-[var(--brand-primary)]" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Live GPS Location Active</p>
                  <p className="text-xs mt-1 font-mono text-gray-500">26.8467° N, 80.9462° E</p>
                </div>
              </div>
            </div>

            {/* Recent Trips */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>Today&apos;s Trips</h3>
              <div className="space-y-4">
                {recentTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white/40">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold" style={{ color: "var(--brand-primary)" }}>{trip.id}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{trip.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700 truncate">{trip.pickup}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700 truncate">{trip.drop}</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-600">+₹{trip.fare}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <h2 className="font-display text-2xl font-bold mb-6 tracking-tight text-gray-800">
              Earnings Overview
            </h2>
            <div className="text-center p-8 rounded-2xl mb-8 border border-blue-100" style={{ background: "linear-gradient(135deg, rgba(2, 89, 221, 0.06), rgba(132, 175, 251, 0.03))" }}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">This Month</p>
              <p className="font-mono text-5xl font-bold mt-2 text-gray-800">₹{mockEarnings.thisMonth.toLocaleString()}</p>
              <p className="text-xs font-bold mt-3 text-emerald-600 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" /> +18% vs last month
              </p>
            </div>

            {/* Weekly bar chart mock */}
            <h3 className="font-display text-lg font-bold mb-6 tracking-tight text-gray-800">This Week</h3>
            <div className="flex items-end gap-3.5 h-44 px-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const heights = [60, 85, 45, 92, 70, 55, 30];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2.5">
                    <div className="w-full bg-gray-200/50 rounded-t-lg h-full flex flex-col justify-end overflow-hidden">
                      <motion.div
                        className="w-full rounded-t-lg"
                        style={{
                          background: i === 3
                            ? "linear-gradient(to top, var(--brand-primary), var(--brand-secondary))"
                            : "linear-gradient(to top, rgba(2, 89, 221, 0.4), rgba(2, 89, 221, 0.2))"
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${heights[i]}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{day}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* KYC Tab */}
        {activeTab === "kyc" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-emerald-50 border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-display text-xl font-bold tracking-tight text-gray-800" style={{ color: "var(--text-primary)" }}>KYC Verified</h2>
              <p className="text-sm font-medium text-gray-500 mt-1.5">Your documents have been verified. You can accept bookings.</p>
            </div>

            {[
              { name: "Aadhaar Card", status: "verified", icon: <FileText className="w-5 h-5 text-emerald-500" /> },
              { name: "Driving License", status: "verified", icon: <FileText className="w-5 h-5 text-emerald-500" /> },
              { name: "Vehicle RC", status: "verified", icon: <FileText className="w-5 h-5 text-emerald-500" /> },
              { name: "Vehicle Photo", status: "verified", icon: <FileText className="w-5 h-5 text-emerald-500" /> },
            ].map((doc) => (
              <div key={doc.name} className="glass-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 border border-emerald-100 shadow-sm">
                  {doc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800" style={{ color: "var(--text-primary)" }}>{doc.name}</p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">Uploaded & verified</p>
                </div>
                <span className="badge badge-delivered font-semibold text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
