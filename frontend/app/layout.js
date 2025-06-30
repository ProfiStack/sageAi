import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthInitializer from "@/CustomComponents/AuthInitializer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "SageeAI",
  description: "SageeAI lifestyle agent",
  icons: {
    icon: "./icon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
