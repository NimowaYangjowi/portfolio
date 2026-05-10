# Structural Flowchart Audit

## Audit rules

| Rule | Requirement | Result |
|---|---|---|
| No dead-end process or decision nodes | Any rectangle or diamond must either continue to another step or be changed to an output/end ellipse. | Passed after fixes |
| No floating nodes | Any non-start node must have an incoming arrow. | Passed |
| Decisions need context | A diamond must have a prior step that defines the data or state being judged. | Passed |
| Arrow direction must be unambiguous | Arrows should be one-way. Return paths should use separate arrows and should not overlap the main direction. | Passed after fixes |
| Loops need exits | Any loop must return through a decision that also has an exit path. | Passed |

## Fixes made in this pass

| Diagram | Issue found | Fix |
|---|---|---|
| Approval Automation | `Creator revision` could look like a terminal recovery box after a validation failure or manual return. | Added a distinct `resubmit` return path from `Creator revision` back to `Submit request`. The loop exits through `Validation + media readiness` when the submission is ready. |
| Media Pipeline | `Temp media status` was a floating process node. The retry loop also overlapped the `Claim with lease -> Media type routing` arrow, making the direction look ambiguous. | Connected `Storefront readiness` failure to `Temp media status`, then to `Retry / backfill`, then back to `Claim with lease` using a lower return path that does not overlap the main arrow. |
| Incident Automation | `Out of scope ignore` and `Duplicate suppress` were terminal states drawn as recovery rectangles. | Changed both to output/end ellipses because the flow intentionally stops there. |
| Incident Automation | `Draft PR -> NEEDS_REVIEW` direction was visually weak. | Rerouted the arrow so it clearly points from `Draft PR` into the `NEEDS_REVIEW report` end state. |

## Intentional exceptions

- `Local worker supervisor` is an ellipse without an incoming arrow because it is a lane-level external start: a local worker process can wake independently from the control-plane heartbeat flow.
- `Render card wall` and `Preview modal handoff` are ellipses because they are user-visible UI results. `Render card wall` still has an outgoing observer path because a visible UI result can trigger a later performance-protection path.
- Terminal suppression states such as `Out of scope ignore`, `Duplicate suppress`, `No diagnostic write`, and `No handoff monitor` are output/end ellipses. They do not need outgoing arrows because they mean "this branch intentionally stops here."

## Decision points for future refinement

- If the portfolio needs a stricter textbook flowchart style, add a dedicated `End` ellipse after every terminal output. The current diagrams use meaningful end-state labels instead, such as `Public media available` or `NEEDS_REVIEW report`, which is more compact for a portfolio modal.
- If `Domain routing` should show separate payment/media/general incident destinations, convert it back to a decision diamond and draw each destination branch. In the current card it stays a process because only one Slack handoff path is shown.
