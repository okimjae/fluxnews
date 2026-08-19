# fluxnews — Engineering Workflow

Development process, branching strategy, environments, and Scrum.

---

## 1. Development Philosophy

**Trunk-Based Development (TBD)**

- `main` is the trunk — always stable, always deployable
- Feature branches are short-lived (ideally 1-2 days max)
- No direct commits to `main`
- Small, frequent PRs — easier to review, fewer conflicts
- CI/CD must pass before any merge

**Why TBD over GitFlow:**
GitFlow creates long-lived branches (`develop`, `release`) that produce complex merges and delay feedback. TBD keeps the team in sync and the codebase always integrable.

---

## 2. Environments

| Environment | Trigger | URL |
|---|---|---|
| **Production** | merge to `main` | `criptosignal.com.br` (and other domains) |
| **Preview** | PR opened | `fluxnews-git-[branch].vercel.app` |
| **Local** | `pnpm dev` | `localhost:3000` |

> There is no `homolog` or `staging` branch. Staging is the **Vercel Preview** environment — created automatically per PR. Test there, approve, merge.

---

## 3. Branch Naming

```
feature/[description]     → new functionality
fix/[description]         → bug fix
chore/[description]       → setup, config, dependencies
ci/[description]          → GitHub Actions, pipelines
docs/[description]        → documentation
refactor/[description]    → refactoring without behavior change
```

**Examples:**
```
feature/researcher-agent
feature/telegram-publisher
fix/seo-keyword-density
chore/supabase-schema
ci/pipeline-cron-workflow
docs/api-endpoints
```

**Rules:**
- Always in English
- Kebab-case
- Descriptive but short (4-5 words max)
- One branch per issue/task

---

## 4. Commit Convention

We follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<optional body>
```

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `chore` | Setup, config, dependencies |
| `ci` | GitHub Actions |
| `refactor` | No behavior change |
| `perf` | Performance improvement |
| `test` | Tests |

**Examples:**
```
feat(agents): add researcher agent with RSS support
fix(seo): correct keyword density threshold calculation
chore(db): add pgvector extension to Supabase schema
ci: add pipeline cron workflow for content generation
docs: update workflow with branching strategy
```

**Subject rules:**
- Imperative present tense: "Add feature" not "Added feature"
- Capitalize first letter
- No period at the end
- Max 70 characters

---

## 5. Pull Request Process

### Opening a PR

1. Branch rebased on `main` (`git rebase main`)
2. All commits follow Conventional Commits
3. PR title follows the same format as commits
4. PR template filled out completely
5. Related issue linked (`Closes #n`)

### See `.github/pull_request_template.md`

### Merge criteria

- [ ] CI passing (Biome + TypeScript + build)
- [ ] Vercel preview URL manually tested
- [ ] PR description filled out
- [ ] Issue linked

### Merge strategy

- **Squash merge** for feature branches → clean history on `main`
- **Merge commit** for significant releases

---

## 6. Scrum Process

### Sprint

- Duration: **2 weeks**
- Each sprint covers one phase from the roadmap
- GitHub Milestones = Sprints

### Ceremonies (adapted for solo/small team)

| Ceremony | Frequency | Format |
|---|---|---|
| Sprint Planning | Sprint start | Move issues from Backlog to Sprint |
| Daily | Daily | Update issue status on board |
| Sprint Review | Sprint end | Test what was delivered |
| Retrospective | Sprint end | Note on Milestone what worked |

### Board Columns

```
📋 Backlog     → created issues, not yet prioritized
🏃 Sprint      → selected for the current sprint
🔨 In Progress → branch created, active development
👀 In Review   → PR open, waiting for approval/testing
✅ Done        → PR merged, issue closed
```

### Labels

| Label | Color | Usage |
|---|---|---|
| `epic` | purple | Groups stories for a phase |
| `story` | blue | User story (deliverable value) |
| `task` | green | Technical task |
| `bug` | red | Incorrect behavior |
| `chore` | gray | Setup, config |
| `blocked` | orange | External impediment |
| `ci` | blue | CI/CD related |

---

## 7. Issue Structure

### Epic (per phase)
```
Epic: Phase 0 — Foundation
Epic: Phase 1 — Content Pipeline
Epic: Phase 2 — Distribution
...
```

### Story
```
As a [persona], I want [feature] so that [benefit].

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

### Task
```
Implement [component/feature]

Technical details:
- Files affected
- Technical approach
- Definition of Done
```

---

## 8. Definition of Done

An issue only moves to **Done** when:

- [ ] Code implemented and committed
- [ ] Preview URL tested (happy path + edge cases)
- [ ] PR merged to `main`
- [ ] Production deploy confirmed
- [ ] Issue closed on the board
- [ ] Documentation updated (if applicable)

---

## 9. Full Flow — Step by Step

```
1. PLANNING
   ├── Open GitHub Project board
   ├── Select issues from Backlog for the Sprint
   └── Move to "Sprint" column

2. DEVELOPMENT
   ├── Pick issue → move to "In Progress"
   ├── git checkout -b feature/[description]
   ├── Develop with small, frequent commits
   └── git push origin feature/[description]

3. REVIEW
   ├── Open PR → Vercel creates preview automatically
   ├── Test on preview URL
   ├── Move issue to "In Review"
   └── Review and approve the PR

4. DELIVERY
   ├── Squash merge → main
   ├── Vercel deploys to production automatically
   ├── Close issue → move to "Done"
   └── Delete feature branch

5. REPEAT
```

---

## 10. CI/CD Pipeline

```yaml
# On every PR:
biome:       biome ci (lint + format check in one command)
type-check:  TypeScript strict
build:       next build
preview:     Vercel preview deploy (automatic)

# On merge to main:
deploy:      Vercel production deploy (automatic)
agents-test: dry-run of Python agents
```

**Why Biome over ESLint + Prettier:**
Biome replaces both in a single Rust binary. 10-100x faster, no rule conflicts between linter and formatter, zero config to get started.

---

*Last updated: 2026-08-18*
