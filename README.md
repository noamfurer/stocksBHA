
# Stocks Widget - Vercel

Widget that lists your chosen tickers with buttons for 1D, 1W, 1M, 3M, 1Y.
Data source: Yahoo Finance (unauthenticated).

## Quick deploy on Vercel
1. Create a new Vercel project and import this folder.
2. No env vars needed.
3. Root directory: the repository root.
4. Build command: none.
5. Deploy. The site will serve `public/index.html` and functions under `/api`.

If you deploy from ZIP:
- Upload or push the files to a new Git repo and connect it to Vercel.
- Or use `vercel` CLI from this folder.

## Notes
- TASE symbols are mapped to Yahoo with `.TA` suffix (e.g., TASE:ALTF -> ALTF.TA).
- If a ticker is missing on Yahoo, it will just be skipped in the list.
- To change the tickers, edit the `TICKERS` array in `public/index.html`.
