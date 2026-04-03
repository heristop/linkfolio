"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function QrCodeButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const generate = useCallback(() => {
    if (!canvasRef.current || !btnRef.current) return;

    // Resolve --color-primary to hex using a 1x1 canvas (works with any CSS color format)
    const card = btnRef.current?.closest(".lf-card") ?? document.body;
    const probe = document.createElement("span");
    probe.style.display = "none";
    probe.style.color = "var(--color-primary)";
    card.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    card.removeChild(probe);

    const cvs = document.createElement("canvas");
    cvs.width = 1;
    cvs.height = 1;
    const ctx = cvs.getContext("2d")!;
    ctx.fillStyle = resolved;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const hex = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

    QRCode.toCanvas(canvasRef.current, globalThis.location.href, {
      width: 180,
      margin: 2,
      color: { dark: hex, light: "#ffffff" },
    });
  }, []);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      generate();
      setCopied(false);
    } else {
      dialogRef.current?.close();
    }
  }, [open, generate]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setOpen(false);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  async function copyUrl() {
    await navigator.clipboard.writeText(globalThis.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(true)}
        aria-label="Show QR code"
        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer opacity-60 transition-[opacity,transform] duration-250 ease-[var(--ease-out-expo)] hover:opacity-100 hover:scale-115 active:scale-92 [&_svg]:w-[20px] [&_svg]:h-[20px] sm:[&_svg]:w-[18px] sm:[&_svg]:h-[18px]"
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
        className="qr-dialog fixed inset-0 m-auto max-w-fit max-h-fit bg-transparent border-none p-0"
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <div className="flex flex-col items-center gap-3 rounded-2xl p-5 bg-[var(--lf-card-bg)] text-[var(--color-primary)] shadow-[0_16px_48px_-8px_oklch(0_0_0/0.25)] border border-[oklch(0_0_0/0.06)] dark:border-[oklch(1_0_0/0.08)] animate-[dialog-slide-in_0.25s_var(--ease-out-expo)_both]">
          <div className="bg-white rounded-[0.625rem] p-2.5">
            <canvas ref={canvasRef} />
          </div>

          <button onClick={copyUrl} className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md cursor-pointer opacity-60 transition-[opacity,transform] duration-200 ease-[var(--ease-out-expo)] hover:opacity-100 active:scale-96">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </div>
      </dialog>
    </>
  );
}
