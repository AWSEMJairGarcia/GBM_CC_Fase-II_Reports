// Data module — ES module fallback for file:// protocol
// This file mirrors data.json but as an importable JS module
export default {
  "startAt": 0,
  "maxResults": 200,
  "total": 12,
  "issues": [
    {
      "key": "AC-443",
      "fields": {
        "summary": "Epic 1: Unified Customer Entity",
        "status": { "name": "In Progress", "statusCategory": { "key": "indeterminate", "name": "In Progress" } },
        "labels": ["sprint-1", "entidad-cliente"],
        "parent": null,
        "assignee": { "displayName": "René Ramos" },
        "created": "2026-05-11T10:00:00.000-0600",
        "updated": "2026-05-20T14:30:00.000-0600",
        "resolutiondate": null
      }
    },
    {
      "key": "AC-444",
      "fields": {
        "summary": "Epic 2: Intelligent Routing",
        "status": { "name": "To Do", "statusCategory": { "key": "new", "name": "To Do" } },
        "labels": ["sprint-5", "routing"],
        "parent": null,
        "assignee": { "displayName": "Iván Rocha" },
        "created": "2026-05-11T10:00:00.000-0600",
        "updated": "2026-05-11T10:00:00.000-0600",
        "resolutiondate": null
      }
    },
    {
      "key": "AC-450",
      "fields": {
        "summary": "Configurar accesos a AWS Connect",
        "status": { "name": "Done", "statusCategory": { "key": "done", "name": "Done" } },
        "labels": ["sprint-0", "accesos"],
        "parent": { "key": "AC-662" },
        "assignee": { "displayName": "Agustín Moglie" },
        "created": "2026-05-12T09:00:00.000-0600",
        "updated": "2026-05-15T16:00:00.000-0600",
        "resolutiondate": "2026-05-15T16:00:00.000-0600"
      }
    },
    {
      "key": "AC-451",
      "fields": {
        "summary": "Definir governance model",
        "status": { "name": "Done", "statusCategory": { "key": "done", "name": "Done" } },
        "labels": ["sprint-0", "governance"],
        "parent": { "key": "AC-662" },
        "assignee": { "displayName": "Jair García" },
        "created": "2026-05-12T09:00:00.000-0600",
        "updated": "2026-05-14T11:00:00.000-0600",
        "resolutiondate": "2026-05-14T11:00:00.000-0600"
      }
    },
    {
      "key": "AC-452",
      "fields": {
        "summary": "Setup Jira board y sprints",
        "status": { "name": "Done", "statusCategory": { "key": "done", "name": "Done" } },
        "labels": ["sprint-0", "governance"],
        "parent": { "key": "AC-662" },
        "assignee": { "displayName": "Sabrina Tejada" },
        "created": "2026-05-12T09:00:00.000-0600",
        "updated": "2026-05-13T15:00:00.000-0600",
        "resolutiondate": "2026-05-13T15:00:00.000-0600"
      }
    },
    {
      "key": "AC-453",
      "fields": {
        "summary": "Mapeo de entidad cliente en Salesforce",
        "status": { "name": "In Progress", "statusCategory": { "key": "indeterminate", "name": "In Progress" } },
        "labels": ["sprint-1", "entidad-cliente", "salesforce"],
        "parent": { "key": "AC-443" },
        "assignee": { "displayName": "René Ramos" },
        "created": "2026-05-19T09:00:00.000-0600",
        "updated": "2026-05-28T10:00:00.000-0600",
        "resolutiondate": null
      }
    },
    {
      "key": "AC-454",
      "fields": {
        "summary": "Diseño de flujo IVR principal",
        "status": { "name": "To Do", "statusCategory": { "key": "new", "name": "To Do" } },
        "labels": ["sprint-1", "routing"],
        "parent": { "key": "AC-444" },
        "assignee": { "displayName": "Iván Rocha" },
        "created": "2026-05-19T09:00:00.000-0600",
        "updated": "2026-05-19T09:00:00.000-0600",
        "resolutiondate": null
      }
    },
    {
      "key": "AC-455",
      "fields": {
        "summary": "Configurar Lambda de integración CRM",
        "status": { "name": "Blocked", "statusCategory": { "key": "indeterminate", "name": "In Progress" } },
        "labels": ["sprint-1", "entidad-cliente", "blocker"],
        "parent": { "key": "AC-443" },
        "assignee": { "displayName": "Agustín Moglie" },
        "created": "2026-05-20T09:00:00.000-0600",
        "updated": "2026-05-22T09:00:00.000-0600",
        "resolutiondate": null
      }
    },
    {
      "key": "AC-456",
      "fields": {
        "summary": "Crear API Gateway para webhooks",
        "status": { "name": "Done", "statusCategory": { "key": "done", "name": "Done" } },
        "labels": ["sprint-1", "infra"],
        "parent": { "key": "AC-448" },
        "assignee": { "displayName": "Iván Rocha" },
        "created": "2026-05-19T09:00:00.000-0600",
        "updated": "2026-06-02T14:00:00.000-0600",
        "resolutiondate": "2026-06-02T14:00:00.000-0600"
      }
    },
    {
      "key": "AC-457",
      "fields": {
        "summary": "Documentar arquitectura de referencia",
        "status": { "name": "Done", "statusCategory": { "key": "done", "name": "Done" } },
        "labels": ["sprint-0", "governance"],
        "parent": { "key": "AC-662" },
        "assignee": { "displayName": "Alex Martínez" },
        "created": "2026-05-12T09:00:00.000-0600",
        "updated": "2026-05-16T17:00:00.000-0600",
        "resolutiondate": "2026-05-16T17:00:00.000-0600"
      }
    },
    {
      "key": "AC-458",
      "fields": {
        "summary": "CR: Agregar canal WhatsApp Business",
        "status": { "name": "To Do", "statusCategory": { "key": "new", "name": "To Do" } },
        "labels": ["sprint-6", "whatsapp", "change-request"],
        "parent": { "key": "AC-445" },
        "assignee": null,
        "created": "2026-06-01T09:00:00.000-0600",
        "updated": "2026-06-01T09:00:00.000-0600",
        "resolutiondate": null
      }
    },
    {
      "key": "AC-662",
      "fields": {
        "summary": "Epic 0: Discovery & Governance",
        "status": { "name": "Done", "statusCategory": { "key": "done", "name": "Done" } },
        "labels": ["sprint-0", "governance", "fase-0"],
        "parent": null,
        "assignee": { "displayName": "Jair García" },
        "created": "2026-05-05T09:00:00.000-0600",
        "updated": "2026-05-16T18:00:00.000-0600",
        "resolutiondate": "2026-05-16T18:00:00.000-0600"
      }
    }
  ]
};
