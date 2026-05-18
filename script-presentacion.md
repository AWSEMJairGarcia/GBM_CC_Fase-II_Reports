# Presentation Script — Sprint Dashboard GBM CC Phase II

## Context
- **Audience**: Carlos Vázquez (VP), Abigail López Berry (PM), GBM team
- **Duration**: 5-7 minutes
- **Goal**: Demonstrate the real-time reporting dashboard for the Amazon Connect Phase II project

---

## Opening (30 sec)

"Good afternoon. I'm going to walk you through the Sprint Dashboard we built to provide real-time visibility into the Amazon Connect Phase II project progress. This dashboard connects directly to Jira and auto-refreshes every 5 minutes."

---

## Demo — Header & Stats (1 min)

*[Show header with GBM | AWS logos]*

"At the top we have the project branding with both logos. On the right you can see the connection indicator — green means we're connected live to Jira. The data you're seeing here is the actual project data right now."

*[Point to the 4 stat cards]*

"These are the main KPIs:
- **Completed**: issues already in Done status
- **In Progress**: what the team is actively working on
- **To Do**: pending backlog
- **Total**: all 220 items in the project including epics, stories, and subtasks"

---

## Demo — Sprint Progress (1 min)

*[Scroll to sprint table]*

"Here we see progress by sprint. Sprint 0 Discovery already has 13 out of 16 tasks completed — the 3 pending ones are the access requests we're waiting on from GBM: the GitHub repo, IAM roles, and Nubity accounts."

"Each sprint shows the progress bar with the exact percentage. Green means 100% complete, orange means in progress, blue means not started yet."

---

## Demo — Epic Progress (1 min)

*[Point to epic table]*

"Epic progress shows all 8 project epics with ALL their stories and subtasks included. For example, Epic 0 Discovery has its 16 direct items plus the subtasks under each story."

"This gives us real visibility into how much work exists per epic — not just the high-level stories but the full technical breakdown."

---

## Demo — Charts (1.5 min)

*[Show Burndown Chart]*

"The Burndown Chart shows the ideal curve vs actual by sprint. The dashed blue line is the ideal — if we completed tasks uniformly. The orange line is reality. You can select any sprint from the dropdown."

*[Show Velocity Chart]*

"Velocity shows how many tasks we complete per sprint. This helps us project capacity for future sprints and detect if the team is accelerating or slowing down."

---

## Demo — Task Board (1 min)

*[Show the 3 columns]*

"Finally the Task Board with 3 columns:
- **Completed**: sorted by date, most recent on top
- **In Progress**: what's being worked on now with the assignee
- **Blocked**: items with the 'blocker' label — these need immediate attention"

"The current blockers are the pending access requests I mentioned — GitHub repo and IAM roles."

---

## Closing — Value & Next Steps (1 min)

"The value of this dashboard:
1. It updates automatically — no manual report generation needed
2. Anyone can access it from the GitHub Pages link
3. It shows real Jira data, not estimates
4. It includes subtasks — all 220 project items

Next steps:
- Deploy the CORS proxy on Cloudflare for permanent live connection
- Add the Executive view with RAG status and milestones
- Add the Compliance view with GDF metrics

Questions?"

---

## Presenter Notes

- **Dashboard URL**: https://awsemjairgarcia.github.io/GBM_CC_Fase-II_Reports/
- **If asked about security**: "Jira credentials are stored only in the user's browser, never in the code or on the server"
- **If asked about refresh rate**: "Data refreshes every 5 minutes automatically when in Live mode"
- **If asked about access**: "Anyone with the link can view the dashboard. Data loads from a static file on GitHub Pages, or live if they configure their Jira credentials"
