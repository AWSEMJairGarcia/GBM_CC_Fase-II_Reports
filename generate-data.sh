#!/bin/bash
# Genera data.json con datos de Jira para el dashboard
# Configurar antes de ejecutar:
#   export JIRA_TOKEN="tu-token-aqui"
#
# Ejecutar:
#   ./generate-data.sh && git add data.json && git commit -m "chore: update data" && git push

set -euo pipefail

JIRA_URL="https://gbmprojects.atlassian.net"
EMAIL="jairgarcia@non-employee.gbm.com"
TOKEN="${JIRA_TOKEN:-}"

if [[ -z "$TOKEN" ]]; then
  echo "Error: export JIRA_TOKEN='tu-token'"
  exit 1
fi

AUTH=$(echo -n "$EMAIL:$TOKEN" | base64)

echo "Fetching data from Jira..."

# Fetch all our issues
curl -s -X POST "$JIRA_URL/rest/api/3/search/jql" \
  -H "Authorization: Basic $AUTH" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"jql":"project = AC AND key >= AC-443 ORDER BY key ASC","fields":["key","summary","status","labels","parent","assignee","created","updated"],"maxResults":200}' \
  > data.json

echo "Data saved to data.json ($(wc -l < data.json) lines)"
echo "Now commit and push to update the dashboard."
