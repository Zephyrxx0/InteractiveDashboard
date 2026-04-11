# Phase 07: Validation Data

This document contains reference outputs for the extraction pipeline using the sample files in `feat_guide/YRA/MPPR Data folder/`.

## Reference Extraction: December 2023.xlsx

**Source**: `feat_guide/YRA/MPPR Data folder/December 2023.xlsx`
**Expected Fields**:
```json
{
  "projectName": "YRA MPPR December 2023",
  "description": "Monthly project progress report for December 2023 covering NGO activities.",
  "budget": {
    "amount": null,
    "currency": "USD",
    "raw": "Monthly report"
  },
  "region": "International / YRA Regions",
  "status": "active",
  "timeframe": {
    "start": "2023-12-01",
    "end": "2023-12-31",
    "duration": "1 month"
  },
  "keyTasks": [
    "December progress reporting",
    "Activity monitoring",
    "Resource allocation check"
  ]
}
```

## Reference Extraction: unstructured_docs.docx

**Source**: `feat_guide/unstructered_docs.docx`
**Expected Fields**:
```json
{
  "projectName": "Unstructured Project Document",
  "description": "A collection of unstructured notes and project details for extraction testing.",
  "budget": {
    "amount": 50000,
    "currency": "USD",
    "raw": "$50,000"
  },
  "region": "Global",
  "status": "planning",
  "timeframe": {
    "start": null,
    "end": null,
    "duration": "6 months"
  },
  "keyTasks": [
    "Initial data gathering",
    "Stakeholder engagement",
    "Drafting implementation plan"
  ]
}
```
