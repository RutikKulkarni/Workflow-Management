import { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 font-sans">
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
