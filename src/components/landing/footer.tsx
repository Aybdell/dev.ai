import Link from 'next/link'
import { Globe, MessageCircle, AtSign } from 'lucide-react'

const footerLinks = {
  Product: [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#', label: 'Changelog' },
  ],
  Developers: [
    { href: '#', label: 'Documentation' },
    { href: '#', label: 'API Reference' },
    { href: '#', label: 'GitHub' },
    { href: '#', label: 'Status' },
  ],
  Company: [
    { href: '#', label: 'About' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-border py-12 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="size-1.5 rounded-sm bg-accent" />
              <span className="font-sans font-bold text-base text-foreground">Dev AI</span>
            </div>
            <p className="text-sm text-muted-text">AI-powered code reviews for developers.</p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-[11px] text-muted-text font-medium tracking-[0.1em] uppercase mb-3">{group}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-muted-text">© 2026 Dev AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-text hover:text-foreground transition-colors"><Globe className="size-[18px]" /></a>
            <a href="#" className="text-muted-text hover:text-foreground transition-colors"><MessageCircle className="size-[18px]" /></a>
            <a href="#" className="text-muted-text hover:text-foreground transition-colors"><AtSign className="size-[18px]" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
