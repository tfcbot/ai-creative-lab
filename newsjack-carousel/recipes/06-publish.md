# 06 — Confirm and publish

See `references/zernio-publish.md` for the endpoint, payload schema, and the `publishNow` gotcha. This recipe covers only the discipline this skill imposes on top.

## Confirmation pattern (mandatory)

Before firing `POST /v1/posts`, surface to the user:

```
About to publish:
  Account: @<username>          ← from /v1/accounts
  Caption: <full caption>       ← from caption.md
  Slides: <N> (cover → CTA)     ← from slide_urls.json
  Schedule: immediate (publishNow: true)

Reply "publish" to fire, or tell me what to change.
```

Wait for explicit go. Posting to a public account is high-blast-radius.

## Polling discipline

Per user feedback (memory `feedback_no_hammer_polling`):

- **Do not start tight poll loops on Zernio without warning.** Tell the user the cadence + total duration before the first poll.
- **Default to ScheduleWakeup** at 2–10 min intervals over `for i in seq 1 N; do curl; sleep 12; done` patterns.
- **Stop on stuck states.** If `lastPublishStage: publishing` for more than ~5 min with no `pendingContainerId` populated, surface the post ID and stop. Don't keep poking.

## Stuck-publish recovery

Symptom: `status: publishing`, `lastPublishStage: publishing`, no `pendingContainerId`, no `publishError`, no movement after 10+ min.

Recovery steps:

1. **Don't PUT.** PUT cannot promote a stuck post; it only demotes status to `draft`.
2. **DELETE the stuck post.** `DELETE /v1/posts/<id>` returns `{ "message": "Post deleted successfully" }`.
3. **Tweak the caption.** Zernio dedups on exact-content within 24h. Change one sentence so the dedup check passes.
4. **POST a fresh request** with `publishNow: true`. The fresh request usually finalizes in 1–3 min when the first one was stuck.
5. **Surface the post ID and stop polling once `status` flips to `published` at the top level** — the IG permalink populates asynchronously and you don't need to watch it.

## Output

`post.md`:

```markdown
# Published carousel

- Zernio post ID: <_id>
- Status: published
- Account: @<username>
- Slides (in carousel order):
  1. <CDN URL>
  ...
- Caption: see caption.md
- Source: <topic URL>
- Format reference: <format URL or "default">
```

Don't include the IG permalink unless the user asks — Zernio sometimes fails to update its own `permalinkUrl` field even when IG accepts the post, and chasing it wastes time.
