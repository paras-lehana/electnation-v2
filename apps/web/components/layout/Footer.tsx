export const Footer = () => (
  <footer className="mt-24 border-t border-khadi-200 bg-khadi-100/60">
    <div className="container-yatra grid gap-8 py-12 md:grid-cols-3">
      <div>
        <h3 className="font-display text-xl font-bold text-ink-900">Election Yatra</h3>
        <p className="mt-2 text-sm text-ink-700">
          A non-partisan civic education companion. We do not endorse any party or candidate.
          Authoritative data links to the{' '}
          <a className="underline" href="https://eci.gov.in" rel="noreferrer" target="_blank">
            Election Commission of India
          </a>
          .
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
          Powered by
        </h4>
        <ul className="mt-2 space-y-1 text-sm text-ink-700">
          <li>Google Gemini · Vertex AI</li>
          <li>Maps, Places & Calendar APIs</li>
          <li>Firebase · Cloud Run</li>
          <li>Built with Google Antigravity</li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
          Accessibility
        </h4>
        <p className="mt-2 text-sm text-ink-700">
          Designed WCAG-AA. Audio-first "Easy Mode" available. Read-aloud on every content card.
        </p>
      </div>
    </div>
    <div className="tricolor-divider opacity-70" />
    <div className="container-yatra py-4 text-center text-xs text-ink-500">
      © {new Date().getFullYear()} Election Yatra · Janta ka Election Saathi
    </div>
  </footer>
);
