import Image from "next/image";
import Link from "next/link";
import { company, contactTopics, formattedAddress, legalNav, mainNav, secondaryNav } from "@/content/site";
import { Finale } from "./finale";
import { ButtonLink, Container } from "./ui";
import { Visual } from "./visual";

/** Every page ends the same way: the system reconnects into the logo. */
export function SiteFooter() {
  return (
    <footer data-tone="dark" className="relative isolate overflow-hidden bg-ink-950 text-paper">
      <section aria-labelledby="finale-title" data-chapter="∞ / Way out" data-tone="dark" className="relative">
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-70">
          <Visual name="horizon" rounded={false} className="!absolute inset-0 !aspect-auto size-full" sizes="100vw" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(7_17_47/0.65)_55%,#07112f_100%)]" />
        </div>
        <Container className="flex flex-col items-center py-24 text-center sm:py-32">
          <Finale className="w-[min(15rem,60vw)]" />
          <h2 id="finale-title" className="t-display mt-12 max-w-[12ch]">
            There is always a way out.
          </h2>
          <p className="t-h3 mt-6 text-signal-300">Let&apos;s find yours.</p>
          <ButtonLink href="/contact" tone="dark" className="mt-10">
            Talk to a guide
          </ButtonLink>
        </Container>
      </section>

      <div className="relative border-t border-ink-800">
        <Container className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image src="/brand/clynera-logo-light.png" alt="Clynera Tech LLC" width={164} height={48} className="h-11 w-auto" />
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-ink-300">IT services, IT consulting and IT staffing from Dallas, Texas. Every system is a maze; we find the way through.</p>
          </div>
          <div className="md:col-span-3">
            <h2 className="t-meta text-ink-400">Contact</h2>
            <address className="mt-4 space-y-2 text-[0.95rem] not-italic text-ink-200">
              <p>{formattedAddress}</p>
              <p>
                <a className="link-line hover:text-paper" href={company.phone.href}>
                  {company.phone.display}
                </a>
              </p>
              <p>
                <a className="link-line hover:text-paper" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </p>
            </address>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-5">
            <div>
              <h2 className="t-meta text-ink-400">Explore</h2>
              <ul className="mt-4 space-y-2 text-[0.95rem] text-ink-200">
                {[...mainNav, ...secondaryNav].map((l) => (
                  <li key={l.href}>
                    <Link className="link-line hover:text-paper" href={l.href}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-meta text-ink-400">Start with</h2>
              <ul className="mt-4 space-y-2 text-[0.95rem] text-ink-200">
                {contactTopics.map((t) => (
                  <li key={t.topic}>
                    <Link className="link-line hover:text-paper" href={`/contact?topic=${t.topic}`}>
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </Container>
        <Container className="flex flex-col gap-4 border-t border-ink-800 py-8 text-[0.85rem] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {company.legalName}. Clynera Tech participates in E-Verify.</p>
          <ul className="flex gap-6">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link className="link-line hover:text-paper" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
