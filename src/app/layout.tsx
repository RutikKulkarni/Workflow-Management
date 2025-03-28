import { Poppins } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import SnackbarWrapper from "@/components/SnackbarWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen bg-gray-100`}>
        <SnackbarWrapper>
          <main className="container mx-auto p-4">{children}</main>
        </SnackbarWrapper>
      </body>
    </html>
  );
}