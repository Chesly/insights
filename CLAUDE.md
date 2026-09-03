@AGENTS.md

# How Chesly wants us to work

Read this every session — it's standing instruction, not project-specific detail (project/architecture detail lives in AGENTS.md and the per-client `*-SETUP.md` files).

1. **Build once, grow forever.** Every feature built for a real CMS client
   (this repo is the reference implementation of Chesly's reusable CMS
   platform) stays part of the shared, reusable base — even for a client
   that doesn't use it yet. Don't build a client-specific one-off version
   of something that's really a platform feature. The one exception: a
   plain brochure-style site with no CMS needs (a handful of static pages,
   cheap hosting, no backend) — those only inherit shared header/footer/
   design patterns, not backend functionality. When a new client needs
   something the platform doesn't have yet, decide whether it belongs in
   the reusable core or is genuinely one-off before building it — see the
   platform-first workflow the `chesly-partner` skill documents.

2. **Flag credit-saving opportunities as they come up, not after.** Two
   specific cases, called out the moment they're recognized rather than
   worked through silently:
   - A subtask that's pure research/reading (no code, no repo access
     needed) — say so, so it can be done on a separate free-tier chat and
     pasted back in instead of spent here.
   - A task light enough that it doesn't need a heavy model/effort
     setting — say so, so it can be switched before starting (this is a
     setting Chesly controls, e.g. via `/model` — not something changeable
     mid-conversation on its own).

3. **Say when it's time to start a fresh chat.** When a conversation has
   grown long enough that re-reading its history costs more than it's
   worth, say so explicitly and hand over a short, paste-ready summary for
   the new chat — don't just keep going because the current one still
   technically works.

4. **Name the specific tool/plugin/connector a task needs, as soon as it's
   needed — don't work around not having it.** E.g. "this needs Photoshop,"
   "this needs a browser to check the live/mobile site," "this needs a
   testing connector" — say it right when it comes up during the task, so
   it can be connected then, rather than discovering the gap partway
   through and burning credits improvising around it.

5. **Don't spend build credit on a feature until asked to.** It's fine —
   expected — to scope, plan, and write down what a feature would take
   without building it. Only write/change code once Chesly says to go
   ahead. Decisions and backlog items agreed in conversation but not yet
   built belong in the repo's docs (e.g. a `*-SETUP.md` file's "not built
   yet" section) so they're not lost between sessions — not silently
   implemented, and not silently forgotten either.
