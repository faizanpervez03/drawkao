import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ProgressProvider } from "@/lib/progress/ProgressProvider";
import { SiteShell } from "@/components/site-shell";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drawkao.vercel.app"),
  title: {
    default: "Draw Kao — Learn Through Drawing for Kids",
    template: "%s | Draw Kao",
  },
  description:
    "Draw Kao helps children ages 4-8 learn letters, words, fruits, animals, shapes, numbers and more through fun drawing activities. Free educational platform for kids.",
  keywords: [
    "kids learning app",
    "children education",
    "learn to draw",
    "alphabet for kids",
    "drawing for children",
    "educational app",
    "kids activities",
    "learn letters",
    "fruits for kids",
    "animals for kids",
    "shapes for kids",
    "early childhood education",
    "pre-school learning",
    "interactive learning",
  ],
  authors: [{ name: "Draw Kao" }],
  creator: "Draw Kao",
  publisher: "Draw Kao",
  applicationName: "Draw Kao",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drawkao.vercel.app",
    siteName: "Draw Kao",
    title: "Draw Kao — Learn Through Drawing for Kids",
    description:
      "Help your child learn letters, words, fruits, animals, shapes and more through fun drawing activities. Designed for ages 4-8.",
    images: [
      {
        url: "/images/DrawKao_Logo.png",
        width: 1200,
        height: 630,
        alt: "Draw Kao - Learn Through Drawing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Draw Kao — Learn Through Drawing for Kids",
    description:
      "Help your child learn letters, words, fruits, animals, shapes and more through fun drawing activities.",
    images: ["/images/DrawKao_Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://drawkao.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Draw Kao",
              alternateName: "DrawKao",
              url: "https://drawkao.vercel.app",
              applicationCategory: "EducationalApplication",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://drawkao.vercel.app/learn?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Draw Kao",
              url: "https://drawkao.vercel.app",
              logo: "https://drawkao.vercel.app/images/DrawKao_Logo.png",
            }),
          }}
        />
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} min-h-full flex flex-col bg-background text-foreground font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <ProgressProvider>
            <SiteShell>{children}</SiteShell>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
