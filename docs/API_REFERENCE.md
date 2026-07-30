# Xi Combinator — API Reference

**Package:** `src/lib/api` · **Version:** `1.0.0` · Last updated: 2026-07-30

A single typed entry point for every backend read/write. Prefer it over calling the
database client directly so audit logging, validation, and error shapes stay consistent.

```ts
import { api } from "@/lib/api";

const { data, error } = await api.cofounders.list({ reviewStatus: "pending" });
```

Every method returns `ApiResult<T> = { data: T | null; error: string | null }` — nothing throws.

---

## `api.audit`

| Method | Signature | Description |
|---|---|---|
| `record` | `(action, table, recordId?, details?) => Promise<void>` | Writes an entry to `admin_audit_log`. Fire-and-forget. |
| `history` | `(table, recordId) => ApiResult<AuditRow[]>` | Full trail for one record, newest first. |
| `list` | `(limit = 2000) => ApiResult<AuditRow[]>` | Global audit feed. |

`action` ∈ `create · update · delete · bulk_update · bulk_delete · note · status_change · password_change`

## `api.cofounders`

| Method | Signature | Notes |
|---|---|---|
| `list` | `({ reviewStatus?, status? }) => ApiResult<Row[]>` | Server-side filtering. |
| `review` | `(id, review_status, review_notes?) => ApiResult<true>` | Approve / reject / re-open + audit. |
| `bulkReview` | `(ids[], review_status, review_notes?) => ApiResult<string[]>` | One confirmation, one audit `bulk_update` row. |
| `update` | `(id, patch) => ApiResult<true>` | Audited edit. |
| `remove` | `(id) => ApiResult<true>` | Audited delete. |

## `api.introductions`

| Method | Signature | Notes |
|---|---|---|
| `list` | `(status?) => ApiResult<Row[]>` | Admin queue. |
| `mine` | `() => ApiResult<Row[]>` | RLS-scoped to the signed-in requester. |
| `setStatus` | `(row, status) => ApiResult<true>` | Audits **and** emails the requester. |
| `setNotes` | `(row, notes) => ApiResult<true>` | Audits **and** emails the requester. |

## `api.notifications`

| Method | Signature |
|---|---|
| `send` | `({ event, to, recipientName?, subjectContext?, notes?, recordId? }) => ApiResult<{ delivered, reason? }>` |

Events: `introduction_approved · introduction_rejected · introduction_updated · cofounder_approved · cofounder_rejected · cofounder_updated`

## `api.table` (generic CRUD)

`list(table, orderBy?)` · `create(table, values)` · `update(table, id, patch)` · `remove(table, id)` — all audited.

---

## Edge functions (HTTP)

Base URL: `https://<project>.functions.supabase.co`

### `POST /send-notification`
Auth: bearer JWT required.

```jsonc
// request
{ "event": "introduction_approved", "to": "founder@example.com",
  "recipientName": "Aditi", "subjectContext": "Sequoia Surge",
  "notes": "Great traction", "recordId": "uuid" }

// response
{ "delivered": true, "subject": "Your introduction request to Sequoia Surge was approved" }
```
Falls back to `{ "delivered": false, "reason": "No email provider configured…" }` when
`RESEND_API_KEY` is not set. Every attempt is written to `admin_audit_log`
(`table_name = 'email_notifications'`).

Optional env: `RESEND_API_KEY`, `NOTIFY_FROM_EMAIL`.

### Other functions
| Function | Purpose |
|---|---|
| `ai-agent-chat` | Streaming AI advisory chat |
| `startup-health-score` | AI health scoring across 5 dimensions |
| `seed-demo-data` | Seeds demo accounts and content |

---

## REST (PostgREST) access

Any table below is also reachable directly, subject to RLS:

```bash
curl "$SUPABASE_URL/rest/v1/cofounder_requests?review_status=eq.approved&select=*" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $USER_JWT"
```

## Changelog
- **1.0.0** (2026-07-30) — Initial package: audit, co-founders, introductions, notifications, generic table CRUD.
