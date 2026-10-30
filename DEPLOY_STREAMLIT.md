# Deploy ItineryPlanner on Streamlit

The Streamlit build is a **standalone Python app** — no database, no API key, no Node.js required.

| File | Purpose |
| --- | --- |
| `app.py` | Full Streamlit application |
| `streamlit_app.py` | Cloud entrypoint that runs `app.py` |
| `requirements.txt` | `streamlit`, `fpdf2` |
| `.streamlit/config.toml` | Theme + server defaults |

## 1. Run locally

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py
```

The app opens on `http://localhost:8501`.

## 2. Deploy on Streamlit Community Cloud (1-click flow)

1. Push this repository to GitHub (include `app.py`, `streamlit_app.py`, `requirements.txt`, `.streamlit/`).
2. Go to <https://share.streamlit.io> → **Create app** → **Deploy a public app from GitHub**.
3. Pick the repo/branch and set **Main file path** to `app.py` (or leave `streamlit_app.py`).
4. Open **Advanced settings** → set Python 3.11+ → **Deploy**.
5. First boot installs `requirements.txt`; the URL looks like `https://<app>.streamlit.app`.

No secrets are required. If you want AI-enriched copy later, add `GROQ_API_KEY` or `GEMINI_API_KEY`
under **App settings → Secrets**.

## 3. What the Streamlit build includes

- **Accounts + guest mode** — email sign-in form and a “Continue as guest” path. Profiles live in
  the Streamlit session (no database), which is the Cloud-friendly zero-dependency model.
- **City + state search** — both origin and destination selectors render `City, State`
  (e.g. `Neemuch, Madhya Pradesh`) from the built-in destination database.
- **INR by default** with a USD toggle.
- **Journey planner** — train / bus / cab options, plus flights **only when both cities have a real
  airport**. Indore → Neemuch correctly returns only Train, Car, Bus.
- **Hotels and restaurants** with Google Maps, Booking.com, MakeMyTrip, Agoda, Airbnb, Zomato and
  EazyDiner links.
- **Booking links** — IRCTC, ConfirmTkt, Ixigo, RedBus, AbhiBus, Google Flights, MakeMyTrip,
  Cleartrip, Uber/Ola.
- **Clustered day plans** with morning / lunch / afternoon / evening slots, INR + USD costs, running
  totals, per-slot swaps, a session trip vault, and an **offline PDF** (plus JSON backup).

## 4. Managing Python version and caching

- Streamlit Cloud rebuilds when `requirements.txt` changes. Use **Manage app → Reboot** after config edits.
- Session state is per-browser; a hard refresh starts a fresh guest session.

## 5. Keeping the Next.js app too

The repository still contains the Next.js implementation (`src/`, `package.json`). It deploys
separately (Vercel or any Node host) and shares the same product model:

```bash
npm install
npm run build
npm start
```

Both builds expose the same features; pick whichever host you need.
