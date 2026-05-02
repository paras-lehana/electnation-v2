import Link from 'next/link';
import { AshokaChakra } from '../motifs/AshokaChakra';

const links = [
  { href: '/yatra', label: 'Yatra' },
  { href: '/clinic', label: 'Forward Clinic' },
  { href: '/sanrakshan', label: 'Vote Sanrakshan' },
  { href: '/easy-mode', label: 'Easy Mode' },
  { href: '/map', label: 'Map' },
  { href: '/google-services', label: 'Google Stack' },
  { href: '/play', label: 'Play' },
  { href: '/about', label: 'About' },
];

export const NavBar = () => (
  <header className="sticky top-0 z-40 border-b border-khadi-200 bg-khadi-50/85 backdrop-blur-md">
    <div className="container-yatra flex flex-wrap items-center justify-between py-4 gap-y-4">
      <Link href="/" className="flex items-center gap-3 font-display text-2xl font-bold">
        <span className="text-indigo-chakra">
          <AshokaChakra size={32} />
        </span>
        <span>
          Election Y<span className="text-saffron-500">atra</span>
        </span>
      </Link>
      <div className="flex items-center gap-2 order-2 md:order-3">
        <select
          aria-label="Language"
          className="rounded-full border border-khadi-300 bg-white/80 px-3 py-1.5 text-sm"
          defaultValue="en"
        >
          <option value="en">EN</option>
          <option value="hi">हिं</option>
          <option value="bn">বাং</option>
          <option value="ta">தமி</option>
        </select>
      </div>
      <nav
        className="flex w-full md:w-auto order-3 md:order-2 gap-4 md:gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-sm items-center pb-1 md:pb-0"
        aria-label="Primary"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-3 py-1.5 font-medium text-ink-700 transition hover:bg-khadi-100 hover:text-ink-900"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
    <div className="tricolor-divider opacity-60" />
  </header>
);
