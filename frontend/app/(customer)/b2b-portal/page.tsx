"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { auth as firebaseAuth } from "@/lib/firebase";
import { Upload, FileDown, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function BulkBookingPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const mockBulkData = [
    { pickupAddress: "Andheri East, Mumbai", dropAddress: "Thane West, Thane", vehicleType: "tempo", loadType: "Boxes", scheduledTime: new Date().toISOString() },
    { pickupAddress: "Bandra Kurla Complex, Mumbai", dropAddress: "Vashi, Navi Mumbai", vehicleType: "truck", loadType: "Pallets", scheduledTime: new Date().toISOString() }
  ];

  const handleBulkUpload = async () => {
    if (!user || !firebaseAuth.currentUser) return;
    setLoading(true);
    setResult(null);

    try {
      const token = await firebaseAuth.currentUser.getIdToken();
      const res = await fetch("http://localhost:5000/api/business/bookings/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ bookings: mockBulkData })
      });
      const json = await res.json();
      if (json.success) {
        setResult({ success: true, ...json.data });
      } else {
        setResult({ success: false, error: json.error || "Upload failed" });
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Bulk Bookings</h1>
      <p className="text-gray-500 mb-8">Upload CSV or JSON files to create multiple shipments at once.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Upload Bulk File</h3>
          <p className="text-sm text-gray-500 mb-6">Supported formats: CSV, Excel. Max 100 rows per file.</p>
          <button 
            onClick={handleBulkUpload}
            disabled={loading}
            className="btn-primary w-full max-w-xs flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {loading ? "Processing..." : "Simulate Upload (Mock Data)"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <FileDown className="w-5 h-5 text-gray-400" /> CSV Template
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Download our standard CSV template to ensure your bulk data is formatted correctly. 
            Required fields: Pickup Address, Drop Address, Vehicle Type.
          </p>
          <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">Download Template (CSV)</a>

          {result && (
            <div className={`mt-8 p-4 rounded-xl border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                <span className={`font-bold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? "Upload Successful" : "Upload Failed"}
                </span>
              </div>
              {result.success ? (
                <div className="text-sm text-green-700">
                  Created: {result.created} | Failed: {result.failed}
                </div>
              ) : (
                <div className="text-sm text-red-700">{result.error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
