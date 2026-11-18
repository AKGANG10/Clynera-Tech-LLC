import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { ViewTransition } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company, siteUrl } from "@/content/site";
import "./globals.css";

// One variable family; the width axis carries display, body and metadata roles.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Clynera Tech: IT Services, IT Consulting and IT Staffing, Dallas TX",
    template: "%s | Clynera Tech",
  },
  description: company.description,
  applicationName: company.shortName,
  openGraph: { type: "website", siteName: company.shortName, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#07112f",
};

/*
 * Runs before first paint:
 * - data-js lets CSS hide the hero's later states only when script can reveal them;
 * - data-awake skips the dormant hero for reduced motion or a repeat visit this session;
 * - the last pointer position is where page transitions collapse and grow.
 */
const bootScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{if(matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("ct-awake"))d.setAttribute("data-awake","")}catch(e){}addEventListener("pointerdown",function(e){d.style.setProperty("--vt-x",e.clientX+"px");d.style.setProperty("--vt-y",e.clientY+"px")},{passive:true,capture:true})})();`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.shortName,
  legalName: company.legalName,
  url: siteUrl,
  logo: `${siteUrl}/brand/clynera-logo.png`,
  description: company.description,
  areaServed: { "@type": "Country", name: "United States" },
  knowsAbout: ["IT services", "IT consulting", "IT staffing", "Software engineering", "Cloud and DevOps", "Data and analytics", "Artificial intelligence", "Cybersecurity", "Automation"],
  email: company.email,
  telephone: company.phone.e164,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.locality,
    addressRegion: company.address.region,
    postalCode: company.address.postalCode,
    addressCountry: company.address.country,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: company.shortName,
  url: siteUrl,
  publisher: { "@type": "Organization", name: company.legalName },
};

const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the boot script sets attributes on <html> before hydration.
    <html lang="en" className={`${archivo.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="t-meta sr-only z-[70] rounded-full bg-ink-950 px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <SiteHeader />
        <ViewTransition default="page">
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
        </ViewTransition>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteJsonLd)} />
      </body>
    </html>
  );
}
