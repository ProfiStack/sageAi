import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthInitializer from "@/CustomComponents/AuthInitializer";
import AuthChecker from "@/shared/utils/useHydration";
import { AmplitudeProvider } from "./providers/amplitudeProvider";

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
  title: "SageeAI – Personalized Skincare & Wellness",
  description:
    "Discover your perfect skincare, makeup, hair, and wellness routines in minutes with SageeAI. Personalized, science-backed, and trusted by thousands.",
  keywords: [
    "skincare AI",
    "personalized beauty routine",
    "makeup recommendations",
    "hair care tips",
    "wellness AI",
    "SageeAI",
    "skincare AI",
    "AI beauty advisor",
    "AI skincare analysis",
    "personalized beauty routine",
    "AI-powered skincare recommendations",
    "smart skincare assistant",
    "AI face analysis for skincare",
    "beauty AI solutions",
    "AI skin analyzer",
    "virtual skincare consultation",
    "Makeup & Hair Care",
    "makeup recommendations",
    "AI makeup advisor",
    "virtual makeup try-on AI",
    "AI foundation matcher",
    "AI lipstick shade finder",
    "hair care AI tips",
    "personalized hair care routine",
    "AI hairstyle suggestions",
    "AI beauty filter",
    "digital makeup consultant",
    "Skincare Routines & Concerns",
    "personalized skincare AI",
    "AI acne treatment recommendations",
    "AI anti-aging skincare tips",
    "AI for dark spots",
    "custom skincare routine generator",
    "AI skin type analysis",
    "best AI skincare app",
    "skincare chatbot AI",
    "AI for sensitive skin care",
    "virtual skincare coach",
    "Wellness & Lifestyle",
    "wellness AI",
    "holistic beauty AI",
    "AI health and beauty assistant",
    "AI stress management tips",
    "AI wellness tracker",
    "nutrition and skincare AI",
    "beauty and wellness AI platform",
    "self-care AI assistant",
    "AI body care tips",
    "AI lifestyle recommendations",
    "Branded & Product-Specific",
    "SageAI skincare",
    "SageAI wellness assistant",
    "SageAI beauty recommendations",
    "SageAI makeup advisor",
    "SageAI personalized skincare",
    "SageAI app",
    "SageAI routines",
    "SageAI face analysis",
    "SageAI AI beauty coach",
    "SageAI product recommendations",
  ],
  openGraph: {
    title: "SageeAI – Your Personalized Beauty Assistant",
    description:
      "Transform your skincare, makeup, hair, nutrition and wellness journey with SageeAI. Tailored to you in minutes.",
    url: "https://sageeai.com",
    siteName: "SageeAI",
    images: [
      {
        url: "https://sageeai.com/icon.ico", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "SageeAI personalized beauty assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  tiktok: {
    card: "summary_large_image",
    title: "SageeAI – Personalized Skincare & Wellness",
    description:
      "AI-powered routines tailored to your skin, makeup, hair, and wellness needs.",
    images: ["https://sageeai.com/icon.ico"], // replace with your twitter image
    creator: "@sageeai",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AmplitudeProvider>
          <Toaster />
          <AuthInitializer />
          <AuthChecker>{children}</AuthChecker>
          <Toaster />
        </AmplitudeProvider>
      </body>
    </html>
  );
}
