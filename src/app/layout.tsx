import type { Metadata } from "next";
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
  title: "Draw Kao — Learn Through Drawing",
  description:
    "Draw Kao helps children learn letters, words, fruits, animals, shapes and more — one drawing at a time.",
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
