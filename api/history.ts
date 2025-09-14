import type { VercelRequest, VercelResponse } from "@vercel/node";

function toYahoo(symbol: string) {
  if (symbol.startsWith("TASE:")) {
    return symbol.replace("TASE:", "") + ".TA";
  }
  return symbol;
}

function rangeToParams(range: string) {
  // Yahoo expects a total range and interval. We fetch a bit more than needed.
  switch (range) {
    case "1D": return { interval: "5m", range: "2d" };
    case "1W": return { interval: "30m", range: "8d" };
    case "1M": return { interval: "1d", range: "2mo" };
    case "3M": return { interval: "1d", range: "6mo" };
    case "1Y": return { interval: "1d", range: "2y" };
    default:   return { interval: "1d", range: "1y" };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const symbol = String(req.query.symbol || "");
    const range  = String(req.query.range || "1M");
    if (!symbol) return res.status(400).json({ error: "symbol is required" });

    const ySymbol = toYahoo(symbol);
    const { interval, range: yRange } = rangeToParams(range);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=${yRange}&interval=${interval}`;
    const r = await fetch(url);
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }
    const json = await r.json();
    const result = json?.chart?.result?.[0];

    const timestamps: number[] = result?.timestamp || [];
    const closes: number[] = result?.indicators?.quote?.[0]?.close || [];

    res.status(200).json({ symbol, ySymbol, timestamps, closes });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "unexpected error" });
  }
}