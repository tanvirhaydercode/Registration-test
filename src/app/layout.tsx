import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Register | Join Us",
  description: "Create your account and get started today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
