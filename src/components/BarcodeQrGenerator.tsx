"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

type Mode = "qr" | "barcode";

const ERROR_LEVELS: { value: "L" | "M" | "Q" | "H"; label: string }[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" }
];

const BARCODE_FORMATS: { value: string; label: string; placeholder: string }[] = [
  { value: "CODE128", label: "CODE128 (any text)", placeholder: "e.g. INV-2026-0042" },
  { value: "EAN13", label: "EAN-13 (12-13 digits)", placeholder: "e.g. 500000000000" },
  { value: "EAN8", label: "EAN-8 (7-8 digits)", placeholder: "e.g. 5000000" },
  { value: "UPC", label: "UPC-A (11-12 digits)", placeholder: "e.g. 12345678901" },
  { value: "CODE39", label: "CODE39", placeholder: "e.g. STOCK-042" },
  { value: "ITF14", label: "ITF-14 (14 digits)", placeholder: "e.g. 12345678901231" },
  { value: "codabar", label: "Codabar", placeholder: "e.g. A12345B" },
  { value: "pharmacode", label: "Pharmacode (number)", placeholder: "e.g. 1234" }
];

function inputCls() {
  return "w-full rounded-sm border border-gold/25 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-gold dark:border-gold/30 dark:bg-navy dark:text-white";
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function BarcodeQrGenerator() {
  const [mode, setMode] = useState<Mode>("qr");

  // QR state
  const [qrText, setQrText] = useState("https://insights.chesly.tech");
  const [qrLevel, setQrLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrFg, setQrFg] = useState("#0a1f44");
  const [qrBg, setQrBg] = useState("#ffffff");
  const [qrError, setQrError] = useState("");
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Barcode state
  const [bcFormat, setBcFormat] = useState("CODE128");
  const [bcValue, setBcValue] = useState("INV-2026-0042");
  const [bcDisplayValue, setBcDisplayValue] = useState(true);
  const [bcLineColor, setBcLineColor] = useState("#0a1f44");
  const [bcError, setBcError] = useState("");
  const bcCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode !== "qr" || !qrCanvasRef.current) return;
    if (!qrText.trim()) {
      setQrError("Enter some text or a URL to generate a QR code.");
      return;
    }
    QRCode.toCanvas(qrCanvasRef.current, qrText, {
      errorCorrectionLevel: qrLevel,
      width: 320,
      margin: 2,
      color: { dark: qrFg, light: qrBg }
    })
      .then(() => setQrError(""))
      .catch((err: Error) => setQrError(err.message || "Could not generate a QR code for this input."));
  }, [mode, qrText, qrLevel, qrFg, qrBg]);

  useEffect(() => {
    if (mode !== "barcode" || !bcCanvasRef.current) return;
    if (!bcValue.trim()) {
      setBcError("Enter a value to generate a barcode.");
      return;
    }
    try {
      JsBarcode(bcCanvasRef.current, bcValue, {
        format: bcFormat,
        displayValue: bcDisplayValue,
        lineColor: bcLineColor,
        background: "#ffffff",
        width: 2,
        height: 90,
        margin: 10,
        valid: (valid) => setBcError(valid ? "" : `"${bcValue}" is not a valid ${bcFormat} value.`)
      });
    } catch {
      setBcError(`"${bcValue}" is not a valid ${bcFormat} value.`);
    }
  }, [mode, bcFormat, bcValue, bcDisplayValue, bcLineColor]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => setMode("qr")}
          className={`rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
            mode === "qr"
              ? "border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy"
              : "border-navy/15 text-navy/60 hover:border-navy dark:border-white/15 dark:text-white/60 dark:hover:border-white"
          }`}
        >
          QR Code
        </button>
        <button
          type="button"
          onClick={() => setMode("barcode")}
          className={`rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
            mode === "barcode"
              ? "border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy"
              : "border-navy/15 text-navy/60 hover:border-navy dark:border-white/15 dark:text-white/60 dark:hover:border-white"
          }`}
        >
          Barcode
        </button>
      </div>

      {mode === "qr" ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_240px]">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
              Text, URL, Wi-Fi details, or anything else
            </label>
            <textarea
              className={`${inputCls()} min-h-[100px] resize-y`}
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="https://example.com"
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
                  Error correction
                </label>
                <select
                  className={inputCls()}
                  value={qrLevel}
                  onChange={(e) => setQrLevel(e.target.value as "L" | "M" | "Q" | "H")}
                >
                  {ERROR_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
                  Foreground
                </label>
                <input
                  type="color"
                  className="h-9 w-full cursor-pointer rounded-sm border border-gold/25 bg-white dark:border-gold/30 dark:bg-navy"
                  value={qrFg}
                  onChange={(e) => setQrFg(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
                  Background
                </label>
                <input
                  type="color"
                  className="h-9 w-full cursor-pointer rounded-sm border border-gold/25 bg-white dark:border-gold/30 dark:bg-navy"
                  value={qrBg}
                  onChange={(e) => setQrBg(e.target.value)}
                />
              </div>
            </div>
            {qrError && <p className="mt-3 text-xs text-red-600">{qrError}</p>}
          </div>

          <div className="flex flex-col items-center justify-start gap-3">
            <div className="flex w-full items-center justify-center border border-navy/10 bg-white p-3 dark:border-white/10">
              <canvas ref={qrCanvasRef} />
            </div>
            <button
              type="button"
              disabled={!!qrError}
              onClick={() => qrCanvasRef.current && downloadCanvas(qrCanvasRef.current, "qr-code.png")}
              className="w-full border border-gold px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold"
            >
              Download PNG
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_280px]">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Format</label>
            <select
              className={inputCls()}
              value={bcFormat}
              onChange={(e) => setBcFormat(e.target.value)}
            >
              {BARCODE_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Value</label>
              <input
                type="text"
                className={inputCls()}
                value={bcValue}
                onChange={(e) => setBcValue(e.target.value)}
                placeholder={BARCODE_FORMATS.find((f) => f.value === bcFormat)?.placeholder}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-navy/75 dark:text-white/70">
                <input
                  type="checkbox"
                  checked={bcDisplayValue}
                  onChange={(e) => setBcDisplayValue(e.target.checked)}
                  className="h-4 w-4"
                />
                Show text under barcode
              </label>
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
                  Bar color
                </label>
                <input
                  type="color"
                  className="h-9 w-full cursor-pointer rounded-sm border border-gold/25 bg-white dark:border-gold/30 dark:bg-navy"
                  value={bcLineColor}
                  onChange={(e) => setBcLineColor(e.target.value)}
                />
              </div>
            </div>
            {bcError && <p className="mt-3 text-xs text-red-600">{bcError}</p>}
          </div>

          <div className="flex flex-col items-center justify-start gap-3">
            <div className="flex w-full items-center justify-center overflow-x-auto border border-navy/10 bg-white p-3 dark:border-white/10">
              <canvas ref={bcCanvasRef} />
            </div>
            <button
              type="button"
              disabled={!!bcError}
              onClick={() => bcCanvasRef.current && downloadCanvas(bcCanvasRef.current, "barcode.png")}
              className="w-full border border-gold px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-navy/50 dark:text-white/40">
        Nothing you type here is sent anywhere — every code is generated entirely in your browser tab.
      </p>
    </div>
  );
}
