import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutGrid,
  Bell,
  Check,
  CircleAlert,
  Inbox,
  RotateCcw,
  Sparkles,
  UploadCloud,
  Mail,
  HelpCircle,
} from 'lucide-react';

import { Alert, Badge, EmptyState, Progress, Skeleton, Tooltip, type Tone } from './ui';
import { getToastDuration } from '../utils/toastDuration';

/** A titled demo card matching the Color Lab's `.card p-5` rhythm. */
function Demo({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="card p-5 space-y-3">
      <div>
        <div className="type-label">{title}</div>
        {hint && <p className="type-caption mt-0.5">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

const SEMANTIC_TONES: Tone[] = ['info', 'success', 'warning', 'danger', 'neutral'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ComponentGallery() {
  // ── Dismissible alert (with restore) ──────────────────────────────────────
  const [showDismissible, setShowDismissible] = useState(true);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const justDismissed = useRef(false);

  const dismissAlert = () => {
    justDismissed.current = true;
    setShowDismissible(false);
  };

  // After the dismissed alert unmounts, move focus to the restore control so
  // keyboard focus is never dropped to <body>.
  useEffect(() => {
    if (!showDismissible && justDismissed.current) {
      restoreRef.current?.focus();
      justDismissed.current = false;
    }
  }, [showDismissible]);

  // ── Inline validation ─────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const valid = EMAIL_RE.test(email);
  const showError = touched && email.length > 0 && !valid;
  const showSuccess = touched && valid;
  // A blank submit must flag the field too — not only non-empty bad input.
  const fieldInvalid = showError || submitError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) {
      setSubmitError(true);
      emailRef.current?.focus();
      return;
    }
    setSubmitError(false);
    fireToast('success', 'You’re on the list', 'We’ll email design-system updates to ' + email + '.');
    setEmail('');
    setTouched(false);
  };

  // ── Loading / progress ────────────────────────────────────────────────────
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(64);
  const [running, setRunning] = useState(false);
  const tickRef = useRef<number | null>(null);

  // Drive the animation from a self-scheduling timeout chain owned by the click
  // handler — never from an effect — so setState only ever runs in async/event
  // callbacks, not synchronously during commit. Effect below is cleanup-only.
  useEffect(() => () => {
    if (tickRef.current) window.clearTimeout(tickRef.current);
  }, []);

  const runUpload = () => {
    if (tickRef.current) window.clearTimeout(tickRef.current);
    setRunning(true);
    setProgress(0);
    const step = (val: number) => {
      const next = Math.min(100, val + 8);
      setProgress(next);
      if (next >= 100) {
        setRunning(false);
        tickRef.current = null;
        fireToast('success', 'Upload complete', 'theme-tokens.json synced to the workspace.');
        return;
      }
      tickRef.current = window.setTimeout(() => step(next), 130);
    };
    tickRef.current = window.setTimeout(() => step(0), 130);
  };

  // ── Toasts ────────────────────────────────────────────────────────────────
  // `richColors` on the <Toaster/> maps these to the same semantic palette as
  // the inline alerts, so toast and banner feedback stay visually consistent.
  function fireToast(kind: 'success' | 'error' | 'warning' | 'info' | 'message', title: string, description?: string) {
    const duration = getToastDuration(`${title} ${description ?? ''}`);
    const fn = kind === 'message' ? toast.message : toast[kind];
    fn(title, { description, duration });
  }

  const fireActionToast = () => {
    // Carries an action ⇒ policy makes it persistent (never auto-dismisses).
    toast('Palette archived', {
      description: 'Heritage Blue moved to your archive.',
      duration: getToastDuration('Palette archived', true),
      action: { label: 'Undo', onClick: () => toast.success('Restored Heritage Blue') },
    });
  };

  const firePromiseToast = () => {
    const save = new Promise<string>((resolve, reject) =>
      setTimeout(() => (Math.random() > 0.18 ? resolve('ok') : reject(new Error('network'))), 1700),
    );
    toast.promise(save, {
      loading: 'Saving palette to your workspace…',
      success: 'Palette saved',
      error: 'Save failed — check your connection and retry',
    });
  };

  return (
    <div className="border-t border-[var(--border)] pt-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="type-eyebrow flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden /> Feedback &amp; States
          </div>
          <h3 className="text-xl font-semibold accent-text mt-1">Component &amp; State Library</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xl">
            Alerts, toasts, badges, validation, and loading states — every tone is icon-paired and
            WCAG&nbsp;AA in both modes, themed by the active accent where appropriate.
          </p>
        </div>
        <Tooltip label="These are interactive demos — click the toast and validation controls to feel the micro-interactions.">
          <span className="demo-badge cursor-help" tabIndex={0}>
            <HelpCircle className="w-3.5 h-3.5" aria-hidden /> Interactive demo
          </span>
        </Tooltip>
      </div>

      {/* Alerts — full width */}
      <Demo
        title="Alerts"
        hint="Severity-ordered. danger announces assertively (role=alert); the rest announce politely (role=status)."
      >
        <div className="space-y-2.5">
          <Alert tone="info" title="New research dropped">
            2026 calm-UI findings were added to the benchmark set this morning.
          </Alert>
          <Alert tone="success" title="Contrast audit passed">
            All 476 token pairs meet WCAG AA across every palette and mode.
          </Alert>
          <Alert
            tone="warning"
            title="Accent runs warm"
            action={{ label: 'Switch to a calm base', onClick: () => fireToast('info', 'Tip', 'Try Navy Authority or Aether Calm as a base.') }}
          >
            Warm accents raise perceived urgency — best used sparingly for CTAs.
          </Alert>
          <Alert
            tone="danger"
            variant="prominent"
            title="Clipboard export failed"
            action={{ label: 'Retry export', onClick: () => fireToast('success', 'Exported as CSS', 'Copied to clipboard.') }}
          >
            Clipboard access needs a secure (https) context. Your tokens were not copied.
          </Alert>

          <AnimatePresence initial={false}>
            {showDismissible ? (
              <motion.div
                key="dismissible"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.2 } }}
              >
                <Alert tone="neutral" title="Dismissible notice" onDismiss={dismissAlert}>
                  Dismissible alerts never auto-close on a timer — the user stays in control.
                </Alert>
              </motion.div>
            ) : (
              <motion.button
                key="restore"
                ref={restoreRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="button"
                onClick={() => setShowDismissible(true)}
                className="btn btn-ghost text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restore dismissed alert
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </Demo>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Toasts */}
        <Demo title="Toasts" hint="Low-priority confirmations. Duration scales with length; actionable toasts never auto-dismiss.">
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-secondary text-xs" onClick={() => fireToast('success', 'Palette applied', 'Aether Calm is now live.')}>
              <Check className="w-3.5 h-3.5" /> Success
            </button>
            <button className="btn btn-secondary text-xs" onClick={() => fireToast('error', 'Could not save', 'Storage quota exceeded.')}>
              <CircleAlert className="w-3.5 h-3.5" /> Error
            </button>
            <button className="btn btn-secondary text-xs" onClick={() => fireToast('warning', 'Unsaved changes', 'Your ratings aren’t exported yet.')}>
              Warning
            </button>
            <button className="btn btn-secondary text-xs" onClick={() => fireToast('info', 'Dark mode is on', 'Theme preference saved.')}>
              Info
            </button>
            <button className="btn btn-secondary text-xs" onClick={() => fireToast('message', 'Heads up', 'A neutral, plain message toast.')}>
              <Bell className="w-3.5 h-3.5" /> Neutral
            </button>
            <button className="btn btn-secondary text-xs" onClick={firePromiseToast}>
              Promise (loading→result)
            </button>
            <button className="btn btn-secondary text-xs" onClick={fireActionToast}>
              <RotateCcw className="w-3.5 h-3.5" /> With action (persistent)
            </button>
          </div>
        </Demo>

        {/* Badges */}
        <Demo title="Status badges" hint="Soft, outline, and dot variants across all tones plus the live accent.">
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-2">
              {SEMANTIC_TONES.map((t) => (
                <Badge key={t} tone={t} variant="soft">
                  {t}
                </Badge>
              ))}
              <Badge tone="accent" variant="soft">
                accent
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {SEMANTIC_TONES.map((t) => (
                <Badge key={t} tone={t} variant="outline" dot>
                  {t}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success" dot>
                Operational
              </Badge>
              <Badge tone="warning" dot>
                Degraded
              </Badge>
              <Badge tone="danger" dot>
                Outage
              </Badge>
              <Badge tone="info" dot>
                Maintenance
              </Badge>
            </div>
          </div>
        </Demo>

        {/* Inline validation */}
        <Demo title="Inline form validation" hint="aria-invalid + aria-describedby; the field describes its own error.">
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            {submitError && (
              <Alert tone="danger" title="Check the form" assertive>
                Enter a valid email address to continue.
              </Alert>
            )}
            <div>
              <label htmlFor="gallery-email" className="type-label block mb-1.5">
                Work email
              </label>
              <input
                id="gallery-email"
                ref={emailRef}
                type="email"
                className="input"
                placeholder="you@studio.com"
                value={email}
                aria-invalid={fieldInvalid}
                aria-describedby="gallery-email-help"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitError) setSubmitError(false);
                }}
                onBlur={() => setTouched(true)}
                style={
                  fieldInvalid
                    ? { borderColor: 'var(--danger)' }
                    : showSuccess
                      ? { borderColor: 'var(--success)' }
                      : undefined
                }
              />
              {/* Status sits in a tone chip (its own ground) — tone-coloured text
                  on the bare card surface can't be guaranteed AA across palettes. */}
              <div id="gallery-email-help" className="mt-1.5">
                {fieldInvalid ? (
                  <span className="badge badge--soft tone-danger" style={{ whiteSpace: 'normal' }}>
                    <CircleAlert size={13} aria-hidden />
                    {email.length === 0 ? 'Enter your email address.' : 'That doesn’t look like a valid email.'}
                  </span>
                ) : showSuccess ? (
                  <span className="badge badge--soft tone-success">
                    <Check size={13} aria-hidden /> Looks good.
                  </span>
                ) : (
                  <span className="type-caption text-[var(--text-muted)]">
                    We’ll only use this for design-system updates.
                  </span>
                )}
              </div>
            </div>
            <button type="submit" className="btn btn-primary text-sm flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Subscribe
            </button>
          </form>
        </Demo>

        {/* Empty state */}
        <Demo title="Empty state" hint="No-data pattern with a single recovery action.">
          <EmptyState
            icon={Inbox}
            titleAs="h4"
            title="No shortlisted palettes yet"
            description="Star palettes you like and they’ll collect here for side-by-side comparison."
            action={
              <button
                className="btn btn-secondary text-sm flex items-center gap-1.5"
                onClick={() => fireToast('info', 'Tip', 'Tap the ★ on any palette card to shortlist it.')}
              >
                <Sparkles className="w-4 h-4" /> How shortlisting works
              </button>
            }
          />
        </Demo>

        {/* Loading & progress */}
        <Demo title="Loading & progress" hint="Skeletons stand in for content; progress shows work isn’t frozen.">
          <div className="space-y-4">
            <div aria-busy={!loaded} aria-live="polite">
              {loaded ? (
                <div className="flex items-center gap-3">
                  <div className="color-swatch !w-10 !h-10 accent-bg" aria-hidden />
                  <div>
                    <p className="font-medium text-sm">Aether Calm</p>
                    <p className="type-caption">Modern calm • benchmark 92</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Skeleton width={40} height={40} radius="9999px" />
                  <div className="flex-1 space-y-2">
                    <Skeleton width="55%" height={12} />
                    <Skeleton width="40%" height={10} />
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-ghost text-xs" onClick={() => setLoaded((v) => !v)}>
              {loaded ? 'Show skeleton' : 'Simulate loaded'}
            </button>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="type-label">Upload — determinate</span>
                <span className="accent-text font-semibold tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} tone="accent" label="Upload progress" />
              <button className="btn btn-ghost text-xs flex items-center gap-1.5 mt-1" onClick={runUpload} disabled={running}>
                <UploadCloud className="w-3.5 h-3.5" /> {running ? 'Uploading…' : 'Run upload'}
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="type-label">Sync — indeterminate</span>
              <Progress tone="info" label="Syncing — please wait" />
            </div>
          </div>
        </Demo>

        {/* Tooltips */}
        <Demo title="Tooltips" hint="Open on hover and keyboard focus; Escape dismisses.">
          <div className="flex flex-wrap items-center gap-4">
            <Tooltip label="Contrast ratio of accent text against the active surface.">
              <button className="btn btn-secondary text-sm">Hover or focus me</button>
            </Tooltip>
            <Tooltip label="WCAG AA requires ≥ 4.5:1 for normal text, ≥ 3:1 for large text.">
              <span tabIndex={0} className="inline-flex items-center gap-1 text-sm accent-text cursor-help">
                <HelpCircle className="w-4 h-4" aria-hidden /> What is AA?
              </span>
            </Tooltip>
          </div>
        </Demo>
      </div>
    </div>
  );
}
