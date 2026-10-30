# ItineryPlanner

Personalized travel itinerary planner. Pick your origin and destination by **city + state**, get a
clustered day-by-day plan, hotel and restaurant picks, train/bus/cab booking links (IRCTC, RedBus,
MakeMyTrip, Google Maps), rupee-first budgets, and an offline PDF.

Two deployable builds share the same product:

| Build | Entry point | Deploy target |
| --- | --- | --- |
| Streamlit (Python) | `app.py` | Streamlit Community Cloud — see [DEPLOY_STREAMLIT.md](DEPLOY_STREAMLIT.md) |
| Web app (Next.js) | `src/app/page.tsx` | Vercel / Node host |

## Streamlit

```bash
pip install -r requirements.txt
streamlit run app.py          # http://localhost:8501
```

- Accounts or **guest mode** (no login required)
- INR default, USD toggle
- Optional AI keys via Streamlit secrets; Demo mode works offline

## Next.js

```bash
npm install
npm run build
npm start
```

- PostgreSQL-backed accounts, sessions, and per-user trip vault (Drizzle ORM)
- API routes for recommendations, itinerary generation, slot swaps, and trips

## Product guarantees

- Flights are offered **only when both cities have commercial airports**. Indore → Neemuch returns
  train, bus, and cab instead.
- Every city field shows `City, State`, sourced from the destination database.
