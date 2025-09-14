import type { VercelRequest, VercelResponse } from "@vercel/node";

function toYahoo(symbol: string) {
  if (symbol.startsWith("TASE:")) return symbol.replace("TASE:", "") + ".TA";
  return symbol;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const symbolsParam = String(req.query.symbols || "");
    if (!symbolsParam) return res.status(400).json({ error: "symbols is required" });
    const list = symbolsParam.split(",").map(s => s.trim()).filter(Boolean);
    const ySymbols = list.map(toYahoo).join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ySymbols)}`;
    const r = await fetch(url);
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }
    const json = await r.json();
    const data = (json?.quoteResponse?.result || []).map((q: any) => ({
      ySymbol: q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent
    }));
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "unexpected error" });
  }
}