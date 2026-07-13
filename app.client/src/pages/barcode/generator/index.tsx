"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Barcode,
  Download,
  Copy,
  CheckCheck,
  Zap,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

// Supported barcode formats and their labels
const BARCODE_FORMATS = [
  { value: "CODE128", label: "CODE 128", description: "Alphanumeric" },
  { value: "EAN13", label: "EAN-13", description: "13 digits" },
  { value: "EAN8", label: "EAN-8", description: "8 digits" },
  { value: "UPC", label: "UPC-A", description: "12 digits" },
  { value: "CODE39", label: "CODE 39", description: "Alphanumeric" },
  { value: "ITF14", label: "ITF-14", description: "14 digits" },
] as const;

type BarcodeFormat = (typeof BARCODE_FORMATS)[number]["value"];

export default function BarcodeGeneratorPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lineColor, setLineColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [barHeight, setBarHeight] = useState(80);
  const [fontSize, setFontSize] = useState(14);

  const generateBarcode = useCallback(() => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value to generate a barcode");
      return;
    }

    try {
      // Dynamically import JsBarcode to avoid SSR issues
      import("jsbarcode").then(({ default: JsBarcode }) => {
        if (!svgRef.current) return;
        JsBarcode(svgRef.current, inputValue.trim(), {
          format,
          lineColor,
          background: bgColor,
          width: 2,
          height: barHeight,
          displayValue: true,
          fontSize,
          margin: 20,
          fontOptions: "bold",
        });
        setGenerated(true);
        toast.success("Barcode generated!");
      });
    } catch (err: any) {
      toast.error("Invalid input for selected format");
    }
  }, [inputValue, format, lineColor, bgColor, barHeight, fontSize]);

  // Auto-regenerate when settings change and we already have a barcode
  useEffect(() => {
    if (generated && inputValue.trim()) {
      generateBarcode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, lineColor, bgColor, barHeight, fontSize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") generateBarcode();
  };

  const downloadBarcode = () => {
    if (!svgRef.current || !generated) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `barcode-${inputValue.trim()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      toast.success("Downloaded!");
    };
    img.src = url;
  };

  const copyToClipboard = async () => {
    if (!svgRef.current || !generated) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/svg+xml": blob }),
      ]);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy the value text
      await navigator.clipboard.writeText(inputValue.trim());
      setCopied(true);
      toast.success("Value copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setInputValue("");
    setGenerated(false);
    setFormat("CODE128");
    setLineColor("#000000");
    setBgColor("#ffffff");
    setBarHeight(80);
    setFontSize(14);
    if (svgRef.current) svgRef.current.innerHTML = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-sm">
              <Barcode className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Barcode Generator
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Type a value, pick a format, and generate instantly
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="gap-2 text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-2 space-y-4">
            {/* Input */}
            <Card className="border-muted shadow-md">
              <CardHeader className="pb-3 pt-4 px-5">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> Input Value
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <Input
                  placeholder="e.g. 123456789012"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="font-mono text-base h-11 focus-visible:ring-primary"
                  autoFocus
                />
                <Button
                  className="w-full h-11 font-semibold text-base gap-2 shadow-md"
                  onClick={generateBarcode}
                  disabled={!inputValue.trim()}
                >
                  <Barcode className="h-5 w-5" />
                  Generate Barcode
                </Button>
              </CardContent>
            </Card>

            {/* Format picker */}
            <Card className="border-muted shadow-md">
              <CardHeader className="pb-3 pt-4 px-5">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Format
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="grid grid-cols-2 gap-2">
                  {BARCODE_FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value as BarcodeFormat)}
                      className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-150 focus:outline-none ${
                        format === f.value
                          ? "border-primary bg-primary/10 shadow-inner"
                          : "border-muted hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <span className="font-bold text-xs tracking-wide">{f.label}</span>
                      <span className="text-[10px] text-muted-foreground">{f.description}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customization */}
            <Card className="border-muted shadow-md">
              <CardHeader className="pb-3 pt-4 px-5">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-muted-foreground flex-1">Bar Color</label>
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="h-8 w-14 rounded-md border cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-muted-foreground flex-1">Background</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-14 rounded-md border cursor-pointer bg-transparent"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">Bar Height</label>
                    <Badge variant="secondary" className="font-mono">{barHeight}px</Badge>
                  </div>
                  <input
                    type="range"
                    min={40} max={160} value={barHeight}
                    onChange={(e) => setBarHeight(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">Font Size</label>
                    <Badge variant="secondary" className="font-mono">{fontSize}px</Badge>
                  </div>
                  <input
                    type="range"
                    min={8} max={24} value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-3">
            <Card className="border-muted shadow-md h-full">
              <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Preview
                </CardTitle>
                {generated && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 font-semibold text-[10px]">
                    ✓ Ready
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="px-5 pb-5 flex flex-col gap-4">
                {/* SVG barcode canvas */}
                <div
                  className="flex items-center justify-center rounded-xl border-2 border-dashed border-muted min-h-[220px] transition-all duration-300 overflow-hidden"
                  style={{ background: generated ? bgColor : undefined }}
                >
                  {!generated ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                      <div className="p-4 rounded-2xl bg-muted/60">
                        <Barcode className="h-12 w-12 opacity-40 stroke-1" />
                      </div>
                      <p className="text-sm font-medium">Your barcode will appear here</p>
                      <p className="text-xs text-muted-foreground/60">Enter a value above and click Generate</p>
                    </div>
                  ) : null}
                  <svg ref={svgRef} className={generated ? "max-w-full" : "hidden"} />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="default"
                    className="flex-1 gap-2 font-semibold shadow"
                    onClick={downloadBarcode}
                    disabled={!generated}
                  >
                    <Download className="h-4 w-4" />
                    Download PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 font-semibold"
                    onClick={copyToClipboard}
                    disabled={!generated}
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-4 w-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy SVG
                      </>
                    )}
                  </Button>
                </div>

                {/* Info */}
                {generated && (
                  <div className="rounded-lg bg-muted/50 px-4 py-3 flex items-center justify-between text-sm gap-2 flex-wrap">
                    <div className="font-mono text-foreground/80 truncate">{inputValue}</div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-[11px]">
                        {BARCODE_FORMATS.find(f => f.value === format)?.label}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
