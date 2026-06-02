import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Career Guidance for Indian Families | Jasmeet Singh",
  description:
    "Jasmeet Singh helps parents and students in Class 8-12 end career confusion. Family Alignment Sessions, psychometric career counselling, and parent coaching for Indian families.",
  openGraph: {
    title: "Stop Guessing Your Child's Career — Get a Plan",
    description:
      "800+ Indian families have used Jasmeet Singh's certified career counselling to agree on a career path. Book a free clarity call.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Jasmeet Singh Career Counselling",
  description:
    "Certified career counsellor and family alignment coach helping Indian families with children in Class 8-12 navigate career decisions together.",
  url: "https://jasmeetsingh.com",
  priceRange: "₹₹",
  areaServed: ["India", "Delhi", "Bangalore", "Mumbai", "NRI families"],
  serviceType: ["Career Counselling", "Family Coaching", "Psychometric Assessment"],
  knowsAbout: [
    "Career Guidance",
    "Family Alignment",
    "Indian Education System",
    "Class 10 Stream Selection",
    "Class 12 Career Options",
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Parents of Indian students in Class 8-12",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
