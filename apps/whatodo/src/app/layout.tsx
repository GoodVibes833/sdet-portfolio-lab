import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import OnboardingModal from "@/components/OnboardingModal";
import OfflineIndicator from "@/components/OfflineIndicator";
import OfflineToast from "@/components/OfflineToast";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import InstallPrompt from "@/components/InstallPrompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import WebVitals from "@/components/WebVitals";
import DarkModeToggle from "@/components/DarkModeToggle";
import { GeolocationProvider } from "@/context/GeolocationContext";
import { PlacesProvider } from "@/context/PlacesContext";
import SwipeBackInit from "@/components/SwipeBackInit";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "오늘 뭐하지? — 지금 주변 핫플 바로 찾기",
  description:
    "오늘 뭐할지 모르겠을 때! 현재 위치 기반으로 주변 맛집, 카페, 액티비티, 야경 스팟을 바로 찾아줘요.",
  keywords: ["오늘뭐하지", "주변맛집", "토론토", "핫플", "카페", "액티비티", "데이트코스", "주변관광"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "오늘 뭐하지?",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#1e3a5f" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (dark) document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${notoSansKR.variable} antialiased`}>
        <GeolocationProvider>
          <PlacesProvider>
            <WebVitals />
            <SwipeBackInit />
            <Navbar />
            <OnboardingModal />
            <LocationPermissionModal />
            <main className="pt-16">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <OfflineIndicator />
            <OfflineToast />
            <InstallPrompt />
            <DarkModeToggle />
          </PlacesProvider>
        </GeolocationProvider>
      </body>
    </html>
  );
}
