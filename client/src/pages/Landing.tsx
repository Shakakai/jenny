import { useState } from 'react';

// ─── Duck icon ────────────────────────────────────────────────────────────────
function DuckIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="14" cy="22" rx="11" ry="6" fill="var(--moss)" />
      <circle cx="24" cy="14" r="5" fill="var(--moss)" />
      <polygon points="29,13 33,15 29,16.5" fill="var(--amber)" />
      <circle cx="25.5" cy="12.5" r="1.3" fill="var(--bg)" />
    </svg>
  );
}

// ─── Email form shared logic ──────────────────────────────────────────────────
function useSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading' || status === 'done') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return { email, setEmail, status, subscribe };
}

// ─── EmailForm ────────────────────────────────────────────────────────────────
function EmailForm({
  email, setEmail, status, onSubmit, id,
}: {
  email: string;
  setEmail: (v: string) => void;
  status: 'idle' | 'loading' | 'done' | 'error';
  onSubmit: (e: React.FormEvent) => void;
  id?: string;
}) {
  if (status === 'done') {
    return (
      <p className="t-success mono" style={{ fontSize: '0.9rem' }}>
        ✓ You're on the list. We'll be in touch.
      </p>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} style={{ display: 'flex', gap: 8, maxWidth: 460 }}>
      <input
        className="input-mono"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === 'loading'}
        style={{ flex: 1 }}
      />
      <button className="btn-primary" type="submit" disabled={status === 'loading'} style={{ flexShrink: 0 }}>
        {status === 'loading' ? '...' : 'Request Access'}
      </button>
    </form>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(14,12,8,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DuckIcon size={24} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            fontSize: '1.05rem', letterSpacing: '0.06em',
            color: 'var(--text)',
          }}>
            DUCKBLIND
          </span>
        </div>
        <a href="#subscribe" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
          Request Access
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ form }: { form: ReturnType<typeof useSubscribe> }) {
  return (
    <section className="dot-grid" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
        padding: '96px 24px',
      }}>
        {/* Left: copy */}
        <div style={{ animation: 'fadeUp 0.6s ease both' }}>
          <p className="section-label">// predictions as a service</p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', marginBottom: 24, lineHeight: 1.1 }}>
            Hide the ML.<br />
            <span style={{ color: 'var(--moss)' }}>Ship the predictions.</span>
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
            Upload a <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>.duckdb</span> file.
            Tell us which column to predict. Get a REST endpoint.
            No pipelines to maintain. No ML team required.
          </p>
          <EmailForm id="subscribe" {...form} />
          {form.status === 'error' && (
            <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
              Something went wrong — try again.
            </p>
          )}
          <p style={{ color: 'var(--dim)', fontSize: '0.75rem', marginTop: 12, fontFamily: 'var(--font-mono)' }}>
            Early access · No credit card required
          </p>
        </div>

        {/* Right: terminal */}
        <div style={{ animation: 'fadeUp 0.6s 0.15s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="terminal">
            <div className="terminal-bar">
              <div className="terminal-dot" style={{ background: '#c44040' }} />
              <div className="terminal-dot" style={{ background: '#c99235' }} />
              <div className="terminal-dot" style={{ background: '#8db840' }} />
              <span style={{ marginLeft: 8, color: 'var(--dim)', fontSize: '0.75rem' }}>terminal</span>
            </div>
            <div className="terminal-body">
              <div className="t-cmd">
                <span style={{ color: 'var(--moss)' }}>$</span>
                {' '}duckblind deploy sales.duckdb --target churn_30d
              </div>
              <div className="t-blank" />
              <div className="t-dim">  Analyzing schema...&nbsp;&nbsp;&nbsp;147 columns, 892k rows</div>
              <div className="t-dim">  Selecting model...&nbsp;&nbsp;&nbsp;&nbsp;XGBoost (baseline AUC 0.81)</div>
              <div className="t-loading">  Training...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;████████████████ 100%</div>
              <div className="t-blank" />
              <div className="t-success">✓ Model deployed</div>
              <div className="t-dim">  Endpoint&nbsp;&nbsp;https://api.duckblind.dev/m/a1b2c3</div>
              <div className="t-dim">  Latency&nbsp;&nbsp;~12ms p99</div>
              <div className="t-blank" />
              <div className="t-cmd">
                <span style={{ color: 'var(--moss)' }}>$</span> <span className="cursor" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stack terminal below on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload',
      body: 'Drop your .duckdb file and tell us which column to predict. That\'s the entire configuration.',
      icon: '⬆',
    },
    {
      num: '02',
      title: 'Train',
      body: 'We analyze your schema, pick the right model architecture, and train it — automatically. You watch a progress bar.',
      icon: '⚙',
    },
    {
      num: '03',
      title: 'Ship',
      body: 'Call your endpoint. GET predictions via REST API. Push new data anytime — the model retrains as your data grows.',
      icon: '→',
    },
  ];

  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section">
        <p className="section-label">// how it works</p>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 56 }}>
          Three steps. Zero ML expertise.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {steps.map(s => (
            <div key={s.num} className="card" style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                color: 'var(--border)', letterSpacing: '0.1em', marginBottom: 16,
                fontSize: '2.5rem', lineHeight: 1,
              }}>
                {s.num}
              </div>
              <div style={{ fontSize: '1.4rem', marginBottom: 12 }}>{s.icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 10, color: 'var(--text)' }}>{s.title}</h3>
              <p style={{ color: 'var(--dim)', fontSize: '0.9rem', lineHeight: 1.65 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why DuckBlind ────────────────────────────────────────────────────────────
function WhySection() {
  const features = [
    {
      title: 'Zero boilerplate',
      body: 'No scikit-learn. No PyTorch. No feature engineering pipeline. A file and a column name is the entire API surface.',
      accent: 'var(--moss)',
    },
    {
      title: 'Self-improving',
      body: 'Push new data and your model retrains. Accuracy compounds over time, automatically. No redeployment required.',
      accent: 'var(--amber)',
    },
    {
      title: 'DuckDB-native',
      body: 'Columnar, fast, embeddable. If your data already lives in DuckDB, you\'re already in the right format.',
      accent: 'var(--moss)',
    },
    {
      title: 'Observable',
      body: 'Every prediction is logged. Drift is detected. You know when your model starts lying — before your users do.',
      accent: 'var(--amber)',
    },
  ];

  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section">
        <p className="section-label">// why duckblind</p>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 16 }}>
          The complexity hides behind the blind.
        </h2>
        <p style={{ color: 'var(--dim)', fontSize: '1rem', marginBottom: 56, maxWidth: 520 }}>
          You don't need to know how XGBoost works. You don't need to know what XGBoost is.
          You just need the answer.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} className="card">
              <div style={{
                width: 32, height: 3, background: f.accent,
                borderRadius: 2, marginBottom: 20,
              }} />
              <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--text)' }}>{f.title}</h3>
              <p style={{ color: 'var(--dim)', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── API Section ──────────────────────────────────────────────────────────────
function APISection() {
  const curlExample =
`# Deploy your model
$ duckblind deploy sales.duckdb \\
    --target churn_30d \\
    --key $DUCKBLIND_KEY

# ✓ Endpoint ready: https://api.duckblind.dev/m/a1b2c3

# Call it from anywhere
$ curl "https://api.duckblind.dev/m/a1b2c3/predict" \\
    -H "Authorization: Bearer $DUCKBLIND_KEY" \\
    -d '{"customer_id": 4829}'

# → {"churn_30d": 0.87, "confidence": 0.91, "latency_ms": 11}`;

  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 64,
          alignItems: 'center',
        }}>
          <div>
            <p className="section-label">// the api</p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 20 }}>
              One endpoint.<br />One JSON field.
            </h2>
            <p style={{ color: 'var(--dim)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 24 }}>
              Deploy with a single CLI command. Call via standard REST.
              The response is a number — the prediction — plus a confidence score.
              That's it.
            </p>
            <p style={{ color: 'var(--dim)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Any language. Any framework. If it can make an HTTP request, it can use DuckBlind.
            </p>
          </div>
          <div className="code-block" style={{ color: 'var(--text)' }}>
            {curlExample.split('\n').map((line, i) => {
              let color = 'var(--text)';
              if (line.startsWith('#')) color = 'var(--dim)';
              else if (line.startsWith('$')) color = 'var(--text)';
              else if (line.startsWith('# →') || line.startsWith('# ✓')) color = 'var(--moss)';
              return (
                <div key={i} style={{ color }}>
                  {line || '\u00a0'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection({ form }: { form: ReturnType<typeof useSubscribe> }) {
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section" style={{ textAlign: 'center' }}>
        <DuckIcon size={40} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginTop: 24, marginBottom: 16 }}>
          Blind spots in your data?<br />
          <span style={{ color: 'var(--moss)' }}>Let's find them.</span>
        </h2>
        <p style={{ color: 'var(--dim)', fontSize: '1rem', marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>
          Join the early access list. First batch of accounts ships Q2 2026.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <EmailForm {...form} />
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: '32px 24px' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DuckIcon size={18} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
            color: 'var(--dim)', letterSpacing: '0.06em',
          }}>
            DUCKBLIND
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--dim)' }}>
          © 2026 DuckBlind. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <a href="/privacy" style={{ color: 'var(--dim)' }}>Privacy</a>
          <a href="/terms" style={{ color: 'var(--dim)' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
export default function Landing() {
  const form = useSubscribe();

  return (
    <div>
      <Nav />
      <Hero form={form} />
      <HowItWorks />
      <WhySection />
      <APISection />
      <CTASection form={form} />
      <Footer />
    </div>
  );
}
