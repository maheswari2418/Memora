# 🧠 Memora — On-Call Incident Memory Copilot

> Submission for the **WeMakeDevs + Cognee Hackathon**  
> **Memora** is the memory layer for B2B SaaS infrastructure. It remembers past incidents, links root causes, and suggests playbook actions so your SRE team resolves outages in minutes, not days.

---

## 🚀 The Problem: On-Call Memory Loss
When an alert fires at 3 AM:
1. **Context is fragmented**: Metrics live in Datadog, commits in GitHub, triage discussions in buried Slack threads, and playbooks in outdated Notion wikis.
2. **Repeating Outages**: The engineer on-call often has no idea this exact failure happened before, who fixed it, or what commands solved it last time.
3. **Keyword search fails**: Searching past logs for `"database down"` misses the PR from 3 days ago that modified connection limits.

---

## 🛠 The Solution: Cognee Graph Traversal
Memora acts as an **on-call incident memory copilot**. Instead of standard vector-search RAG, Memora runs on **Cognee**'s hybrid vector-graph database:

* **Ingest Multi-Source Context**: We parse GitHub commits, Datadog triggers, Slack triage discussions, and Notion runbooks.
* **Trace Upstream Links**: If service A crashes because of service B's deployment, Cognee's graph connects them via service dependencies.
* **Cites Every Record**: Memos are rendered in plain-English, with inline footnotes linking directly back to the original commits, alerts, and Slack links.
* **Human-in-the-Loop (HITL) Gates**: Small changes auto-run. Larger fixes require approval. When you approve and resolve, we call `cognee.improve()` to reinforce that resolution pathway for future incidents.

---

## 🧬 How Cognee is Integrated

Memora utilizes the core Cognee APIs:

1. **`cognee.remember(payload)`**:
   Normalizes alerts, commit histories, Slack discussions, and runbooks into semantic strings and ingests them into the memory layer.
2. **`cognee.cognify()`**:
   Traverses the incoming memory stream, extracts entities (microservices, errors, developers), and builds a structured, queryable knowledge graph.
3. **`cognee.recall(query)`**:
   Performs a hybrid search combining vector similarity with relationship traversals to fetch similar past incident memories based on contextual relationships.
4. **`cognee.improve()`**:
   Triggered upon successful incident resolution. Reinforces graph node weights, teaching the model which historical actions successfully resolved which alert configurations.

---

## 🎨 Design Aesthetics (Manthan.quest Inspired)
We built Memora following the ultra-clean, technical design language of **Manthan.quest**:
* **Theme**: Deep-black `#0a0a0a` background with a subtle CSS grid alignment.
* **Typography**: Modern typography using `Geist` for body/headings and `Instrument Serif` for italicized accent subtitles.
* **Palette**: Curated mint green brand accents (`#16d05e`), alert red, and warning amber.
* **Layout**: Section-by-section landing page presenting features, SRE review gates, interactive audit timelines, and the live incident copilot console.

---

## 📦 Zero-Configuration Mock Mode (For Judges)
We know it can be a hassle to set up third-party tokens during hackathon reviews. 

If you do not have Slack, GitHub, or PagerDuty credentials, **Memora detects this and automatically falls back to local JSON mock databases** inside the `data/` folder:
* [github_pulls.json](data/github_pulls.json) — Mock PR history.
* [pagerduty_incidents.json](data/pagerduty_incidents.json) — Mock incident lists.
* [slack_messages.json](data/slack_messages.json) — Mock troubleshooting messages.
* [datadog_alerts.json](data/datadog_alerts.json) — Mock metrics alerts.

You only need an **OpenAI API Key** to run the LLM-powered incident summaries!

---

## ⚡ Quick Start

### 1. Prerequisites
* Python 3.9+
* OpenAI API Key (set in your environment)

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```
*(If `requirements.txt` is not present, install: `pip install fastapi uvicorn python-dotenv openai cognee httpx`)*

### 3. Set up Environment
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your-openai-api-key
```

### 4. Run the Sandbox Server
```bash
python app.py
```

### 5. Open in Browser
Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your browser:
* **Landing Page**: Explore the Manthan-style product walkthrough.
* **Interactive Console**: Click **"Try Now"** or go to `/dashboard` to launch the live copilot simulator.
* **Seeding & Traversal**: Click **"Ingest Real Data"** to pull the fallback files, see the live event stream, trigger a diagnosis, and run `cognee.improve()`.

---

## 📁 File Structure
```
memora/
├── data/                       # Mock API databases
│   ├── github_pulls.json       # Mock commits/PRs
│   ├── datadog_alerts.json     # Mock metric alerts
│   ├── slack_messages.json     # Mock incident channels
│   └── pagerduty_incidents.json# Mock active incidents
├── static/                     # Frontend Assets
│   ├── index.html              # Manthan landing page
│   ├── dashboard.html          # Interactive SRE console
│   ├── app.js                  # Traversal animations & fetch calls
│   └── style.css               # Modern dark-mode grid stylesheet
├── app.py                      # FastAPI server & Cognee routers
├── real_ingest.py              # Ingest driver (GH, Slack, PagerDuty, Datadog)
├── seed_data.py                # Synthetic incident models
└── requirements.txt            # Package list
```
