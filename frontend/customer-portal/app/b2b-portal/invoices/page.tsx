"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { auth as firebaseAuth } from "@/lib/firebase";
import { FileText, Download, Loader2, Search } from "lucide-react";
import { generateInvoicePDF } from "@/lib/pdf";

export default function B2BInvoicesPage() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user || !firebaseAuth.currentUser) return;
      try {
        const token = await firebaseAuth.currentUser.getIdToken();
        const res = await fetch("http://localhost:5000/api/business/invoices", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setInvoices(json.data);
        } else {
          setError(json.error || "Failed to fetch invoices");
        }
      } catch (err) {
        console.error(err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Invoices & Billing</h1>
          <p className="text-gray-500">Manage your B2B account statements and download tax invoices.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Booking Ref..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-8 text-center text-red-500 font-medium">{error}</div>
        )}

        {!error && invoices.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Invoices Found</h3>
            <p>You haven't completed any B2B shipments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Booking Ref</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Route</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{inv.bookingRef}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium truncate max-w-[200px]">{inv.pickup}</p>
                      <p className="text-gray-500 text-xs truncate max-w-[200px]">→ {inv.drop}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">₹{inv.amount}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => generateInvoicePDF(inv)}
                        className="text-blue-600 font-semibold hover:text-blue-700 hover:underline flex items-center justify-end gap-1 ml-auto"
                      >
                        <Download className="w-4 h-4" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
