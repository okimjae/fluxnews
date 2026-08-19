# fluxnews — Engineering Workflow

Processo de desenvolvimento, branching strategy, Scrum e ambientes.

---

## 1. Development Philosophy

**Trunk-Based Development (TBD)**

- `main` é o trunk — sempre estável, sempre deployável
- Feature branches são curtas (idealmente 1-2 dias)
- Nenhum commit direto em `main`
- PRs pequenos e frequentes — mais fácil de revisar, menos conflito
- CI/CD passa antes de qualquer merge

**Por que TBD e não GitFlow:**
GitFlow cria branches de longa duração (`develop`, `release`) que geram merges complexos e atrasam feedback. TBD mantém o time sincronizado e o código sempre integrável.

---

## 2. Ambientes

| Ambiente | Trigger | URL |
|---|---|---|
| **Production** | merge em `main` | `criptosignal.com.br` (e outros domínios) |
| **Preview** | PR aberto | `fluxnews-git-[branch].vercel.app` |
| **Local** | `npm run dev` | `localhost:3000` |

> Não existe branch `homolog` ou `staging`. O ambiente de staging é o **Vercel Preview** — criado automaticamente por PR. Teste ali, aprove, mergea.

---

## 3. Branch Naming

```
feature/[description]     → nova funcionalidade
fix/[description]         → correção de bug
chore/[description]       → setup, config, dependências
ci/[description]          → GitHub Actions, pipelines
docs/[description]        → documentação
refactor/[description]    → refatoração sem mudança de comportamento
```

**Exemplos:**
```
feature/researcher-agent
feature/telegram-publisher
fix/seo-keyword-density
chore/supabase-schema
ci/pipeline-cron-workflow
docs/api-endpoints
```

**Regras:**
- Sempre em inglês
- Kebab-case
- Descritivo mas curto (máximo 4-5 palavras)
- Uma branch por issue/task

---

## 4. Commit Convention

Seguimos **Conventional Commits**:

```
<type>(<scope>): <subject>

<body opcional>
```

| Type | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `chore` | Setup, config, deps |
| `ci` | GitHub Actions |
| `refactor` | Sem mudança de comportamento |
| `perf` | Otimização |
| `test` | Testes |

**Exemplos:**
```
feat(agents): add researcher agent with RSS support
fix(seo): correct keyword density threshold calculation
chore(db): add pgvector extension to Supabase schema
ci: add pipeline cron workflow for content generation
docs: update workflow with branching strategy
```

**Regras do subject:**
- Imperativo presente: "Add feature" não "Added feature"
- Primeira letra maiúscula
- Sem ponto no final
- Máximo 70 caracteres

---

## 5. Pull Request Process

### Abrindo um PR

1. Branch atualizada com `main` (`git rebase main`)
2. Todos os commits seguem Conventional Commits
3. PR title segue o mesmo formato do commit
4. Preencher o PR template completamente
5. Linkar a issue relacionada (`Closes #n`)

### PR Template

Ver `.github/pull_request_template.md`

### Critérios para merge

- [ ] CI passando (lint, build, type-check)
- [ ] Preview URL testado manualmente
- [ ] PR description preenchida
- [ ] Issue linkada

### Merge strategy

- **Squash merge** para feature branches → histórico limpo em `main`
- **Merge commit** para releases importantes

---

## 6. Scrum Process

### Sprint

- Duração: **2 semanas**
- Cada sprint cobre uma fase do roadmap
- Milestones no GitHub = Sprints

### Cerimônias (adaptadas para solo/pequeno time)

| Cerimônia | Frequência | Formato |
|---|---|---|
| Sprint Planning | Início do sprint | Mover issues do Backlog para Sprint |
| Daily | Diário | Atualizar status das issues no board |
| Sprint Review | Fim do sprint | Testar o que foi entregue |
| Retrospectiva | Fim do sprint | Nota no Milestone sobre o que funcionou |

### Board Columns

```
📋 Backlog    → issues criadas mas não priorizadas
🏃 Sprint     → selecionadas para o sprint atual
🔨 In Progress → branch criada, desenvolvimento ativo
👀 In Review  → PR aberto, aguardando aprovação/teste
✅ Done       → PR mergeado, issue fechada
```

### Labels

| Label | Cor | Uso |
|---|---|---|
| `epic` | roxo | Agrupa stories de uma fase |
| `story` | azul | User story (entregável de valor) |
| `task` | verde | Tarefa técnica |
| `bug` | vermelho | Comportamento incorreto |
| `chore` | cinza | Setup, config |
| `blocked` | laranja | Impedimento externo |

---

## 7. Issue Structure

### Epic (por fase)
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
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3
```

### Task
```
Implement [component/feature]

Technical details:
- Arquivo(s) afetado(s)
- Abordagem técnica
- Definition of Done
```

---

## 8. Definition of Done

Uma issue só vai para **Done** quando:

- [ ] Código implementado e commitado
- [ ] Preview URL testado (caminho feliz + edge cases)
- [ ] PR mergeado em `main`
- [ ] Deploy em produção confirmado
- [ ] Issue fechada no board
- [ ] Documentação atualizada (se aplicável)

---

## 9. Fluxo Completo — Passo a Passo

```
1. PLANEJAMENTO
   ├── Abrir GitHub Project
   ├── Selecionar issues do Backlog para o Sprint
   └── Mover para coluna "Sprint"

2. DESENVOLVIMENTO
   ├── Pegar issue → mover para "In Progress"
   ├── git checkout -b feature/[description]
   ├── Desenvolver em commits pequenos e frequentes
   └── git push origin feature/[description]

3. REVIEW
   ├── Abrir PR → Vercel sobe preview automático
   ├── Testar no preview URL
   ├── Mover issue para "In Review"
   └── Revisar e aprovar o PR

4. ENTREGA
   ├── Squash merge → main
   ├── Vercel deploya em produção automaticamente
   ├── Fechar issue → mover para "Done"
   └── Deletar branch feature

5. REPEAT
```

---

## 10. CI/CD Pipeline

```yaml
# Em cada PR:
biome:       biome ci (lint + format check em um comando)
type-check:  TypeScript strict
build:       next build
preview:     Vercel preview deploy (automático)

# Em merge para main:
deploy:      Vercel production deploy (automático)
agents-test: dry-run dos agentes Python
```

**Por que Biome e não ESLint + Prettier:**
Biome substitui ambos em um único binário escrito em Rust. É 10-100x mais rápido,
sem conflito de regras entre linter e formatter, e zero config para começar.

---

*Última atualização: 2026-08-18*
