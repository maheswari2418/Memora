import os
import json
import asyncio
from datetime import datetime, timedelta
import httpx
import cognee
from dotenv import load_dotenv

load_dotenv()

# API Configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
PAGERDUTY_API_KEY = os.getenv("PAGERDUTY_API_KEY")
DATADOG_API_KEY = os.getenv("DATADOG_API_KEY")

async def ingest_github_deployments(repo_owner: str, repo_name: str, lookback_hours: int = 24):
    """
    Fetch merged Pull Requests / Commits representing deployments.
    Falls back to local mock data if credentials are missing.
    """
    pulls = []
    if GITHUB_TOKEN:
        url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/pulls"
        headers = {
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        }
        params = {
            "state": "closed",
            "sort": "updated",
            "direction": "desc",
            "per_page": 20
        }
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, params=params)
                if response.status_code == 200:
                    pulls = response.json()
        except Exception as e:
            print(f"[-] GitHub API call failed: {e}")
    
    # Fallback to local file if empty
    if not pulls:
        local_path = "data/github_pulls.json"
        if os.path.exists(local_path):
            print(f"[*] Loading GitHub PRs from local fallback: {local_path}")
            with open(local_path, "r", encoding="utf-8") as f:
                pulls = json.load(f)

    now = datetime.utcnow()
    for pr in pulls:
        # Check if merged recently
        merged_at_str = pr.get("merged_at")
        if not merged_at_str:
            continue
        
        pr_data = f"""
        Source Type: GitHub Pull Request (Deployment)
        PR Number: #{pr['number']}
        Title: {pr['title']}
        Author: {pr['user']['login']}
        Merged At: {merged_at_str}
        URL: {pr.get('html_url', '')}
        Description: {pr.get('body', '')}
        Affected Code/Services: {pr.get('head', {}).get('ref', '')}
        """
        
        print(f"[+] Ingesting GitHub PR #{pr['number']} into Cognee...")
        await cognee.remember(pr_data)

async def ingest_slack_conversations(channel_id: str, lookback_hours: int = 12):
    """
    Ingest troubleshooting messages from incident Slack channels.
    Falls back to local mock files if token is missing.
    """
    messages = []
    if SLACK_BOT_TOKEN:
        url = "https://slack.com/api/conversations.history"
        headers = {"Authorization": f"Bearer {SLACK_BOT_TOKEN}"}
        oldest_timestamp = (datetime.utcnow() - timedelta(hours=lookback_hours)).timestamp()
        params = {
            "channel": channel_id,
            "oldest": str(oldest_timestamp),
            "limit": 100
        }
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, params=params)
                res_data = response.json()
                if res_data.get("ok"):
                    messages = res_data.get("messages", [])
        except Exception as e:
            print(f"[-] Slack API call failed: {e}")

    # Fallback to local files
    if not messages:
        local_path = "data/slack_messages.json"
        if os.path.exists(local_path):
            print(f"[*] Loading Slack messages from local fallback: {local_path}")
            with open(local_path, "r", encoding="utf-8") as f:
                messages = json.load(f)

    for msg in messages:
        if "subtype" in msg:
            continue
            
        timestamp_str = msg.get("ts")
        timestamp = datetime.utcfromtimestamp(float(timestamp_str)).isoformat() if timestamp_str else datetime.utcnow().isoformat()
        
        slack_data = f"""
        Source Type: Slack Incident Conversation
        Channel ID: {channel_id}
        Timestamp: {timestamp}
        User ID: {msg.get('user', 'unknown')}
        Message Content: {msg.get('text', '')}
        """
        
        print(f"[+] Ingesting Slack message from {msg.get('user')} into Cognee...")
        await cognee.remember(slack_data)

async def ingest_pagerduty_incidents(lookback_hours: int = 24):
    """
    Fetch active or resolved PagerDuty incidents.
    Falls back to local mock data if API key is missing.
    """
    incidents = []
    if PAGERDUTY_API_KEY:
        url = "https://api.pagerduty.com/incidents"
        headers = {
            "Authorization": f"Token token={PAGERDUTY_API_KEY}",
            "Accept": "application/vnd.pagerduty+json;version=2"
        }
        since_date = (datetime.utcnow() - timedelta(hours=lookback_hours)).strftime("%Y-%m-%dT%H:%M:%SZ")
        params = {"since": since_date, "limit": 50}
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, params=params)
                if response.status_code == 200:
                    incidents = response.json().get("incidents", [])
        except Exception as e:
            print(f"[-] PagerDuty API call failed: {e}")

    if not incidents:
        local_path = "data/pagerduty_incidents.json"
        if os.path.exists(local_path):
            print(f"[*] Loading PagerDuty incidents from local fallback: {local_path}")
            with open(local_path, "r", encoding="utf-8") as f:
                incidents = json.load(f)

    for inc in incidents:
        pd_data = f"""
        Source Type: PagerDuty Incident
        Incident ID: {inc['id']}
        Number: {inc.get('incident_number')}
        Title: {inc.get('title')}
        Status: {inc.get('status')}
        Service Name: {inc.get('service', {}).get('summary', '')}
        Created At: {inc.get('created_at')}
        Urgency: {inc.get('urgency')}
        Description: {inc.get('description', '')}
        """
        
        print(f"[+] Ingesting PagerDuty Incident #{inc.get('incident_number')} into Cognee...")
        await cognee.remember(pd_data)

async def ingest_datadog_alerts():
    """
    Fetch active Datadog alerts from local fallback or webhook payloads.
    """
    alerts = []
    local_path = "data/datadog_alerts.json"
    if os.path.exists(local_path):
        print(f"[*] Loading Datadog alerts from local fallback: {local_path}")
        with open(local_path, "r", encoding="utf-8") as f:
            alerts = json.load(f)

    for alert in alerts:
        dd_data = f"""
        Source Type: Datadog Monitor Alert
        Alert ID: {alert['id']}
        Check Title: {alert['check']}
        Metric Target: {alert['metric']}
        Threshold Limit: {alert['threshold']}
        Triggered Value: {alert['value']}
        Status: {alert['status']}
        Timestamp: {alert['timestamp']}
        """
        print(f"[+] Ingesting Datadog Alert {alert['id']} into Cognee...")
        await cognee.remember(dd_data)

async def run_pipeline(github_owner: str, github_repo: str, slack_channel: str):
    """
    Run full ingestion sweep and rebuild memory graph.
    """
    print("[*] Starting Memora Ingestion Loop...")
    
    # 1. Ingest from sources (using Fallbacks if API keys are missing)
    await ingest_github_deployments(github_owner, github_repo)
    await ingest_pagerduty_incidents()
    await ingest_slack_conversations(slack_channel)
    await ingest_datadog_alerts()
    
    # 2. Rebuild the graph
    print("[*] Processing new memories with cognee.cognify()...")
    await cognee.cognify()
    print("[+] Pipeline run complete. Knowledge Graph updated!")

if __name__ == "__main__":
    # Test run configuration
    asyncio.run(run_pipeline(
        github_owner="my-org", 
        github_repo="payment-service", 
        slack_channel="C012345678"
    ))

