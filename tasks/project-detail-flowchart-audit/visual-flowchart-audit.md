# Visual Flowchart Audit

## Audit criteria

| Criterion | What was checked | Result |
|---|---|---|
| Text occlusion | Node text, lane titles, and branch labels should not be crossed by arrows. | Passed after fixes |
| Node-arrow alignment | Arrows should enter and leave near node edges or center lines without looking detached. | Passed |
| Line ambiguity | Return paths should not overlap forward arrows or look bidirectional. | Passed after fixes |
| Line breaks | Node labels should be readable in 2-4 short lines without cramped long words. | Passed |
| Diagram density | Recovery loops should not make the chart look unfinished or tangled. | Passed with noted exceptions |

## Fixes made

| Diagram | Visual issue | Fix |
|---|---|---|
| Approval Automation | The automatic approval path crossed the `Approved publish` output area, and the long handoff line ran too close to the `Creator revision` box. | Routed `Audit trail` directly into `Approved publish` and moved the long handoff line below the revision box edge. |
| Media Pipeline | The retry-to-upload loop crossed the `Frontend upload` lane title. | Rerouted the dashed loop around the top and left side of the lane title before entering `File selected`. |
| Incident Automation | The `duplicate` branch label sat too close to the decision diamond and terminal suppression node. | Moved the label into clearer whitespace beside the branch arrow. |
| Redis Traffic | The `diagnostic off` label overlapped the outgoing arrow from the diagnostic decision. | Moved the label below the line so the branch remains legible. |
| Worker Platform | The failover and recovery loops crossed node titles, node bodies, or text-heavy areas. | Rerouted the failover check path outside the local worker node and moved the recovery loop below the no-handoff output area. |

## Remaining intentional choices

- Mixed Korean and English is retained where the node names represent developer-facing UI or infrastructure terms, such as `Worker Ops Dashboard`, `Redis hash with TTL`, and `Browser -> R2`.
- Some return paths are long dashed lines because the diagrams show operational loops. They are kept as dashed orange paths so they read as recovery or secondary paths rather than primary execution.
- Output ellipses use meaningful end-state labels instead of a generic `End` label to keep the portfolio modal compact.
