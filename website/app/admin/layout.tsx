import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — CargoHub",
  description: "Manage bookings, drivers, KYC verification, and view analytics.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
