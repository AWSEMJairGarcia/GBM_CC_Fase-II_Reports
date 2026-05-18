#!/bin/bash
# generate-data.sh — Fetch Jira data and save to data.json
# Usage: JIRA_TOKEN=your-token ./generate-data.sh

set -e

# Validate token
if [ -z "$JIRA_TOKEN" ]; then
  echo "ERROR: JIRA_TOKEN environment variable is not set."
  echo "Usage: JIRA_TOKEN=your-token ./generate-data.sh"
  exit 1
fi

# Configuration
JIRA_URL="https://gbmprojects.atlassian.net"
EMAIL="jairgarcia@non-employee.gbm.com"
PROJECT_KEY="AC"

# Build JQL query
JQL="project = ${PROJECT_KEY} AND key >= AC-443 ORDER BY key ASC"
FIELDS="key,summary,status,labels,parent,assignee,created,updated,resolutiondate"
MAX_RESULTS=200

# Encode credentials
AUTH=$(echo -n "${EMAIL}:${JIRA_TOKEN}" | base64)

# API URL
API_URL="${JIRA_URL}/rest/api/3/search"

echo "Fetching issues from Jira..."
echo "JQL: ${JQL}"

# Fetch data
curl -s -X GET \
  "${API_URL}?jql=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${JQL}'))")&fields=${FIELDS}&maxResults=${MAX_RESULTS}" \
  -H "Authorization: Basic ${AUTH}" \
  -H "Content-Type: application/json" \
  -o data.json

# Validate response
if [ ! -f data.json ] || [ ! -s data.json ]; then
  echo "ERROR: Failed to fetch data from Jira."
  exit 1
fi

# Check for errors in response
if grep -q '"errorMessages"' data.json; then
  echo "ERROR: Jira returned an error:"
  cat data.json
  exit 1
fi

# Count issues
ISSUE_COUNT=$(python3 -c "import json; data=json.load(open('data.json')); print(data.get('total', 0))")
echo "Success! Fetched ${ISSUE_COUNT} issues."
echo "Data saved to data.json"
