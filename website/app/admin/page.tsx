"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Truck, Package, IndianRupee, Users, Shield,
  Search, Bell, ChevronDown, TrendingUp, TrendingDown, Clock,
  CheckCircle2, XCircle, AlertTriangle, Eye, MoreVertical,
  ArrowUpRight, ArrowDownRight, MapPin, Star, Filter,
  Activity, BarChart3, Calendar,
} from "lucide-react";

// ── Mock Data ───────────────────────────────────────────────────────────────

const recentBookings = [
  { id: "FA-K8X7YT", user: "Rahul Sharma", driver: "Suresh Kumar", pickup: "Hazratganj", drop: "Gomti Nagar", vehicle: "Tata Ace", status: "DELIVERED", fare: 847, time: "12 min ago" },
  { id: "FA-L9M2AB", user: "Priya Logistics", driver: "Ramesh Yadav", pickup: "Alambagh", drop: "Chinhat", vehicle: "Tempo 407", fare: 1523, status: "IN_TRANSIT", time: "28 min ago" },
  { id: "FA-N3P5CD", user: "Amit Verma", driver: "—", pickup: "Charbagh", drop: "Aliganj", vehicle: "Pickup Truck", fare: 623, status: "PENDING", time: "2 min ago" },
  { id: "FA-Q7R1EF", user: "Sneha Gupta", driver: "Ajay Singh", pickup: "Indira Nagar", drop: "Mahanagar", vehicle: "Tata Ace", fare: 432, status: "ACCEPTED", time: "5 min ago" },
  { id: "FA-T2U8GH", user: "Vikram Corp", driver: "Manoj Tiwari", pickup: "Vikas Nagar", drop: "Jankipuram", vehicle: "Large Truck", fare: 2890, status: "DRIVER_ARRIVING", time: "8 min ago" },
  { id: "FA-W4X6IJ", user: "Deepa Mills", driver: "Suresh Kumar", pickup: "Lalbagh", drop: "Daliganj", vehicle: "Tempo 407", fare: 1190, status: "CANCELLED", time: "1 hr ago" },
];

const pendingKyc = [
  { id: "DRV-004", name: "Vijay Patel", vehicle: "Large Truck", vehicleNo: "UP32GH3456", docs: 4, submitted: "2 hours ago" },
  { id: "DRV-006", name: "Ravi Mishra", vehicle: "Tata Ace", vehicleNo: "UP32KL1234", docs: 3, submitted: "5 hours ago" },
  { id: "DRV-007", name: "Sanjay Dubey", vehicle: "Tempo 407", vehicleNo: "UP32MN5678", docs: 4, submitted: "1 day ago" },
];

const statusColors: Record<string, string> = {
  PENDING: "badge-pending",
  ACCEPTED: "badge-accepted",
  DRIVER_ARRIVING: "badge-arriving",
  PICKED_UP: "badge-arriving",
  IN_TRANSIT: "badge-transit",
  DELIVERED: "badge-delivered",
  CANCELLED: "badge-cancelled",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DRIVER_ARRIVING: "Arriving",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// ── Sidebar Nav ─────────────────────────────────────────────────────────────

const sidebarItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", active: true },
  { icon: <Package className="w-5 h-5" />, label: "Bookings" },
  { icon: <Truck className="w-5 h-5" />, label: "Drivers" },
  { icon: <IndianRupee className="w-5 h-5" />, label: "Payments" },
  { icon: <Shield className="w-5 h-5" />, label: "KYC Queue" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics" },
  { icon: <Users className="w-5 h-5" />, label: "Users" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen flex bg-mesh bg-grid" style={{ background: "var(--bg-primary)" }}>
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 min-h-screen p-6 glass" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderBottom: "none" }}>
        {/* Logo */}
        <div className="flex items-center gap-3.5 px-3 py-4 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
            🚛
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>CargoHub</span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Admin Control</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1.5">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: activeTab === item.label ? "var(--brand-primary)" : "var(--text-secondary)",
                background: activeTab === item.label ? "rgba(2, 89, 221, 0.08)" : "transparent",
                border: activeTab === item.label ? "1px solid rgba(2, 89, 221, 0.12)" : "1px solid transparent",
              }}
            >
              <span style={{ color: activeTab === item.label ? "var(--brand-primary)" : "var(--text-muted)" }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Admin profile */}
        <div className="p-4 rounded-2xl border border-gray-150/60 mt-4" style={{ background: "rgba(255,255,255,0.4)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
              FA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>CargoHub Admin</p>
              <p className="text-xs font-semibold text-gray-400" style={{ color: "var(--text-muted)" }}>Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-45 flex items-center justify-between px-8 h-20 glass" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Dashboard</h1>
            <span className="badge font-semibold" style={{ background: "rgba(16, 185, 129, 0.08)", color: "var(--brand-success)", border: "1px solid rgba(16, 185, 129, 0.15)", fontSize: "10px" }}>
              <Activity className="w-3.5 h-3.5" /> Live Control
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search bookings, drivers..." className="input-field pl-11 bg-white/70" style={{ width: 320, height: 42, fontSize: "13px" }} />
            </div>
            <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:shadow-sm transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white shadow-sm" style={{ background: "var(--brand-danger)" }}>3</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* ── Stats Grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Today's Bookings", value: "127", change: "+12% vs yesterday", positive: true, icon: <Package className="w-5 h-5" /> },
              { label: "Revenue Today", value: "₹1,84,200", change: "+8.3% vs last week", positive: true, icon: <IndianRupee className="w-5 h-5" /> },
              { label: "Active Drivers", value: "48", change: "-2 drivers offline", positive: false, icon: <Truck className="w-5 h-5" /> },
              { label: "Pending KYC", value: "3", change: "Requires review", positive: false, icon: <Shield className="w-5 h-5" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(2, 89, 221, 0.08)", color: "var(--brand-primary)" }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>{stat.value}</div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-bold flex items-center ${stat.positive ? "text-emerald-600" : "text-amber-600"}`}>
                    {stat.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : stat.change.includes("review") ? <AlertTriangle className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {" "}{stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Recent Bookings Table ─────────────────────────────────── */}
            <motion.div
              className="lg:col-span-2 glass-card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Recent Bookings</h2>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[var(--brand-primary)] transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary text-xs font-semibold px-4 py-2">View All</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">User</th>
                      <th className="pb-3">Driver</th>
                      <th className="pb-3">Route</th>
                      <th className="pb-3">Vehicle</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Fare</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="text-sm">
                        <td className="py-4">
                          <span className="font-mono text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>{b.id}</span>
                        </td>
                        <td className="py-4 font-semibold text-gray-800">{b.user}</td>
                        <td className="py-4 text-gray-600">{b.driver}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-[var(--brand-primary)]" />
                            <span className="text-xs font-medium text-gray-700">{b.pickup}</span>
                            <span className="text-[10px] text-gray-400">→</span>
                            <span className="text-xs font-medium text-gray-700">{b.drop}</span>
                          </div>
                        </td>
                        <td className="py-4 text-xs font-medium text-gray-500">{b.vehicle}</td>
                        <td className="py-4">
                          <span className={`badge ${statusColors[b.status]} font-semibold`}>
                            {statusLabels[b.status]}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="font-mono text-sm font-bold text-gray-800">₹{b.fare.toLocaleString()}</span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[var(--brand-primary)] transition-all">
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* ── KYC Queue + Quick Stats ───────────────────────────────── */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* KYC Queue */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>KYC Queue</h2>
                  <span className="badge badge-pending font-semibold">{pendingKyc.length} pending</span>
                </div>

                <div className="space-y-4">
                  {pendingKyc.map((driver) => (
                    <div key={driver.id} className="p-4 rounded-xl flex items-center gap-3.5 border border-gray-100" style={{ background: "rgba(255,255,255,0.4)" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-[#F59E0B]" style={{ background: "rgba(245, 158, 11, 0.08)" }}>
                        {driver.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-gray-800" style={{ color: "var(--text-primary)" }}>{driver.name}</p>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5">{driver.vehicle} · {driver.vehicleNo}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-500 transition-all" title="Approve">
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 transition-all" title="Reject">
                          <XCircle className="w-4.5 h-4.5 text-red-550" style={{ color: "var(--brand-danger)" }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Status Distribution */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-bold mb-6 tracking-tight" style={{ color: "var(--text-primary)" }}>Status Breakdown</h2>
                <div className="space-y-4">
                  {[
                    { status: "Delivered", count: 89, total: 127, color: "#10B981" },
                    { status: "In Transit", count: 15, total: 127, color: "#0ea5e9" },
                    { status: "Accepted", count: 12, total: 127, color: "#0259dd" },
                    { status: "Pending", count: 8, total: 127, color: "#f59e0b" },
                    { status: "Cancelled", count: 3, total: 127, color: "#ff6648" },
                  ].map((item) => (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-gray-600">{item.status}</span>
                        <span className="font-mono text-xs font-bold text-gray-800">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-gray-200/50">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / item.total) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Drivers */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-bold mb-6 tracking-tight" style={{ color: "var(--text-primary)" }}>Top Drivers Today</h2>
                <div className="space-y-4">
                  {[
                    { name: "Suresh Kumar", trips: 12, earnings: 8450, rating: 4.9 },
                    { name: "Ajay Singh", trips: 10, earnings: 7200, rating: 4.8 },
                    { name: "Ramesh Yadav", trips: 8, earnings: 6100, rating: 4.7 },
                  ].map((d, i) => (
                    <div key={d.name} className="flex items-center gap-3.5">
                      <span className="font-mono text-sm font-bold w-6 text-center" style={{ color: i === 0 ? "#FBBF24" : i === 1 ? "#94A3B8" : "#CD7F32" }}>
                        #{i + 1}
                      </span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: `hsl(${i * 120 + 200}, 60%, 45%)` }}>
                        {d.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800" style={{ color: "var(--text-primary)" }}>{d.name}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{d.trips} trips · ₹{d.earnings.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-800">{d.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
