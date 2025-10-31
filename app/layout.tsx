import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Aharraa - Premium Food Delivery",
    template: "%s | Aharraa",
  },
  description:
    "Subscribe to delicious meals delivered daily. Fresh, healthy, and convenient food delivery services.",
  keywords: [
    "food delivery",
    "meal subscription",
    "healthy food",
    "premium meals",
    "Aharraa",
  ],
  authors: [{ name: "Aharraa" }],
  creator: "Aharraa",
  publisher: "Aharraa",
  metadataBase: new URL("https://aharraa.com"), // Replace with your actual domain
  openGraph: {
    title: "Aharraa - Premium Food Delivery",
    description:
      "Subscribe to delicious meals delivered daily. Fresh, healthy, and convenient food delivery services.",
    url: "https://aharraa.com", // Replace with your actual domain
    siteName: "Aharraa",
    images: [
      {
        url: "/logo.png", // Replace with a high-res image for Open Graph
        width: 800,
        height: 600,
        alt: "Aharraa Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aharraa - Premium Food Delivery",
    description:
      "Subscribe to delicious meals delivered daily. Fresh, healthy, and convenient food delivery services.",
    images: ["/logo.png"], // Replace with a high-res image for Twitter Card
    creator: "@Aharraa", // Replace with your Twitter handle
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.className}`}>
      <body suppressHydrationWarning>
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
        <AuthProvider>
          <div className="bg-background text-foreground">{children}</div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
