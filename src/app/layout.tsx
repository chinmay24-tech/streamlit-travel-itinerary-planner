import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ItineryPlanner — Personalized Travel Itinerary Planner",
  description: "Plan clustered day-by-day trips from your city, with hotels, restaurants, IRCTC, RedBus, and Maps booking links.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
