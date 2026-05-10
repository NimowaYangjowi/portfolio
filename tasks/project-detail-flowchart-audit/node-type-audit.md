# Flowchart Node Type Audit

## Node type rules

| Type | Shape | Use when | Easy explanation |
|---|---|---|---|
| `entry` | ellipse | A flow starts from an external trigger or lane-specific starting point | 시작점 |
| `process` | rectangle | Work happens and then continues to the next step | 작업 상자 |
| `decision` | diamond | The flow asks a question and branches into two or more outcomes | 질문 상자 |
| `recovery` | orange rectangle | Failure, fallback, retry, suppression, or manual recovery work happens | 복구 상자 |
| `output` | ellipse | The flow reaches a visible or terminal result | 끝 상태 |

## Audit summary

| Diagram | Result | Fixes applied |
|---|---|---|
| Approval Automation | Updated | `Autonomous approval` and `Audit trail` were changed from terminal/recovery-looking nodes to process nodes because the flow continues to publish. `Agent check` was changed from entry to process because it is not a new external start. |
| Media Pipeline | Updated | `Browser to R2 upload`, `Result writeback`, and `Temp media status` were changed from output/recovery to process because they are intermediate state transitions, not final states. |
| Marketplace Feed | Updated again | `Prefetch allowance check` now branches directly into `Batched prefetch` when allowance remains and `On-demand only` when the allowance is spent. `Batched prefetch` was changed from recovery to process because it is a normal performance optimization, not a fallback. `Render card wall` and `Preview modal handoff` remain outputs because they are user-visible surface results. |
| Incident Automation | Updated again | `Replay + dedup guard` remains a decision because it branches into new vs duplicate. `Slack thread created` and `Agent ACK reaction` remain process nodes because the incident continues after those steps. `Domain routing` was changed back to process because this diagram shows one routed Slack path rather than multiple domain branches. |
| Redis Traffic | Updated again | `Route bucket + policy` remains a decision because it branches into protected vs excluded traffic. `Diagnostic session active?` now branches into `Redis hash with TTL` when diagnostics are enabled and `No diagnostic write` when diagnostics are disabled. `Redis hash with TTL` remains process because it is diagnostic recording, not recovery. |
| Worker Platform | Updated | `Failover eligibility` remains decision, but now has both eligible and ineligible branches. The ineligible path ends at `No handoff monitor`, so the diamond is justified. |

## Remaining intentional choices

- Some lane starts, such as `Local worker supervisor`, remain `entry` because they are the first node inside that visual lane even though they are not the whole system's first trigger.
- Recovery color is reserved for actual retry/fallback/failover work, not for every operational side effect.
- Output ellipses are now reserved for user-visible or terminal states such as publish, public media, preview modal, dashboard, no-handoff monitor, and rate-limit/handler responses.
- A diamond is only kept when the rendered flow shows two or more outgoing outcomes. If the implementation concept has branches but the card does not show those branches, the node should be a process instead.
