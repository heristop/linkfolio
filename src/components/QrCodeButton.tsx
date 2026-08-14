"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const FALLBACK_COLOR = "#000000";

/** Read a CSS custom property as a computed color, scoped to the card it belongs to. */
function readCssColor(anchor: HTMLElement, variable: string): string {
  const card = anchor.closest(".lf-card") ?? document.body;
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = `var(${variable})`;
  card.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved;
}

/** Convert any CSS color notation to hex by painting it on a 1x1 canvas. */
function toHexColor(color: string): string {
  const cvs = document.createElement("canvas");
  cvs.width = 1;
  cvs.height = 1;
  const ctx = cvs.getContext("2d");
  if (!ctx) return FALLBACK_COLOR;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export default function QrCodeButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  // Loaded on open, not on import: the encoder is ~20 kB of the client bundle
  // for a dialog most visitors never open, and every page that renders the
  // card would otherwise pay for it before first paint.
  const generate = useCallback(async () => {
    const canvas = canvasRef.current;
    const button = btnRef.current;
    if (!canvas || !button) return;

    const dark = toHexColor(readCssColor(button, "--color-primary"));
    const { toCanvas } = await import("qrcode");

    await toCanvas(canvas, globalThis.location.href, {
      width: 180,
      margin: 2,
      color: { dark, light: "#ffffff" },
    });
  }, []);

  useEffect(() => {
    if (!open) {
      dialogRef.current?.close();
      return;
    }

    dialogRef.current?.showModal();
    setCopied(false);

    // The encoder chunk can fail to load (offline, blocked). The dialog itself
    // still works, so that must not surface as an unhandled rejection.
    async function draw() {
      try {
        await generate();
      } catch {
        // No QR code; the Copy link button still gives the visitor the URL.
      }
    }

    void draw();
  }, [open, generate]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Native <dialog> already closes on Escape, which fires "close".
    const handleClose = () => setOpen(false);
    // Light dismiss: a click on the backdrop targets the dialog element itself.
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) setOpen(false);
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
    };
  }, []);

  async function copyUrl() {
    // `navigator.clipboard` is undefined outside a secure context, and the
    // write itself can be denied — a self-hosted page on plain http is the
    // ordinary case here, not an edge one.
    if (typeof navigator === "undefined" || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(globalThis.location.href);
      setCopied(true);

      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Degrade silently: the URL is still on screen to copy by hand.
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Show QR code"
        className="lf-icon-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="8" height="8" rx="1" />
          <rect x="14" y="2" width="8" height="8" rx="1" />
          <rect x="2" y="14" width="8" height="8" rx="1" />
          <path d="M14 14h2v2h-2z" />
          <path d="M20 14h2v2h-2z" />
          <path d="M14 20h2v2h-2z" />
          <path d="M20 20h2v2h-2z" />
          <path d="M17 17h2v2h-2z" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="QR code for this page"
        className="qr-dialog fixed inset-0 m-auto max-w-fit max-h-fit bg-transparent border-none p-0"
      >
        <div className="qr-panel flex flex-col items-center gap-3 rounded-2xl p-5 bg-(--lf-card-bg) text-primary shadow-[0_16px_48px_-8px_oklch(0_0_0/0.25)] border border-[oklch(0_0_0/0.06)] dark:border-[oklch(1_0_0/0.08)]">
          <div className="bg-white rounded-[0.625rem] p-2.5">
            {/* The dialog itself is already named "QR code for this page",
                and the URL is available through Copy link, so the canvas adds
                nothing a screen reader can use. */}
            <canvas ref={canvasRef} aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={copyUrl}
            className="lf-qr-copy lf-cta-ghost flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md opacity-(--lf-button-opacity)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {copied ? (
                <path d="M20 6 9 17l-5-5" />
              ) : (
                <>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </>
              )}
            </svg>
            {copied ? "Copied!" : "Copy link"}
          </button>

          {/* The button's own label change is not announced on its own. */}
          <output className="sr-only">
            {copied ? "Link copied to clipboard" : ""}
          </output>
        </div>
      </dialog>
    </>
  );
}
