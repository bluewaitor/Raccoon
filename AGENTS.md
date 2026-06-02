## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore


<claude-mem-context>
# Memory Context

# [Raccoon] recent context, 2026-06-02 10:29am GMT+8

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 12 obs (2,999t read) | 0t work

### May 14, 2026
166 11:04a 🔵 Office Hours session requested
167 11:09a ✅ Enabled continuous checkpoint mode for gstack
168 12:20p 🔵 Project requirements defined for utility tools web app
169 12:21p 🔵 Research on existing open-source developer utility tools
170 1:05p 🔵 Office hours session initiated
171 1:08p 🔵 Raccoon project concept and technical requirements identified
172 1:10p 🔵 IT-Tools competitor analysis reveals Vue.js architecture with 100+ utilities
173 " 🔵 Dark mode UX implementation research identifies CSS best practices
174 1:12p 🔵 Pipe-chaining system identified as key Raccoon differentiator
175 " ⚖️ Raccoon architecture defined: Vite + React 19 + TypeScript + Tailwind v4 stack
176 " 🔵 it-tools and transform.tools identified as 50% starting points
177 2:49p 🔵 Raccoon developer toolbox initial design mockup created
</claude-mem-context>