# PR review rules

Rules for the Claude PR review. Review comments are written in Korean.

## Scope

- Review every changed file in the PR, including docs, infra and `.github/`.
- Skip lockfiles, generated files and binaries.
- The workflow withholds approval when `.github/`, any `CLAUDE.md` or any `.claude/` path changes. Review those files anyway.

## Execution order

`{PR_NUMBER}`, `{REPO}` and `{RULES_DIR}` are given in the prompt.

1. Gather info in parallel:
   - `gh pr diff {PR_NUMBER}`
   - `gh pr view {PR_NUMBER} --json title,body,files`
   - existing inline comments: `gh api --method GET repos/{REPO}/pulls/{PR_NUMBER}/comments --paginate`
   - existing issue comments: `gh api --method GET repos/{REPO}/issues/{PR_NUMBER}/comments --paginate`
   - Run each command as its own Bash call, exactly as written. No `;`, `&&`, pipes or shell variables.
2. Read the rules only for the areas the diff touches:
   - `frontend/`: read `{RULES_DIR}/frontend/CLAUDE.md`, then the `react-best-practices` and `nextjs` skills it points to under `{RULES_DIR}/frontend/.claude/skills/`.
   - `backend/`: read `{RULES_DIR}/backend/CLAUDE.md` and `{RULES_DIR}/backend/README.md`, then the skills under `{RULES_DIR}/backend/.claude/skills/` whose description matches the changed code.
   - Other paths: no project rule file. Review for correctness, security and consistency with the surrounding files.
   - Read in parallel only the rule files relevant to the changed code.
3. Read surrounding code with Read, Glob and Grep when the diff alone is not enough.
4. Collect all candidate issues first, then rank them by severity and keep the top 10. Do not write comments in this step.
5. Write the comments in parallel with `mcp__github_inline_comment__create_inline_comment`.

## Severity

- CRITICAL: must be fixed before merge (bug, type safety, security, broken build).
- WARNING: recommended fix. Never blocks approval.

Project-specific CRITICAL cases (verified build failures or explicit project bans):

- Barrel files (`index.ts` that only re-exports) and re-exports. The project forbids them. Imports must point to each file directly.
- Seed dotted access (for example `TextField.Root`) in a file without `"use client"`.
- Backend: `@Enumerated(EnumType.STRING)` without `columnDefinition = "varchar(N)"`. `ddl-auto: validate` fails and the app does not start.
- Backend: `ex.getMessage()` or other internal details put in a response body.
- Backend: `@Setter`, `@Data`, `@Builder` or `@AllArgsConstructor`. The project forbids them.
- Backend: access to another domain's repository instead of its service.
- Backend: an entity returned from a service or exposed by a controller.

FSD layer rules and Seed usage are defined in the frontend sources. Backend rules are defined in the backend `CLAUDE.md` and skills. Follow them as they are and do not restate them.

## Comment format

Write each comment in Korean, inline on the exact diff line.

````
### 🔴 CRITICAL: rule name

#### 문제

why this code is a problem, briefly.

#### 제안

```tsx
// corrected code (use java for backend files)
```

#### 근거

`skill file path` > rule name
````

For a warning, the title is `### 🟡 WARNING: rule name`. The 근거 section must cite the skill file and the rule the comment is derived from.

## Line number accuracy

- Use the `+` side line numbers (new file) shown in the diff.
- The `@@ -old,count +new,count @@` header gives the start line of the hunk on the `+` side. Count from it to the exact line.
- Never guess. Comment only on lines that appear in the diff output, inside a hunk range.
- If a file is fully deleted and there is no `+` side line, do not comment on it.

## Limits

- At most 10 inline comments. CRITICAL first.
- Duplicate avoidance: if a comment for the same file and the same rule already exists, skip it, regardless of resolved state. Still count the issue if the problem persists in the current code.
- If unsure whether the code violates a rule, skip it. Accuracy matters more than reaching 10.
- If nothing is worth flagging, post nothing.

## Approval decision

Review the whole PR diff at the current head on every run, not only the latest commit.

- If information gathering or any tool call is incomplete, or the judgment is uncertain: `review_status=incomplete`, `approval_recommendation=do_not_approve`.
- If any CRITICAL issue remains in the current code: `approval_recommendation=do_not_approve`.
- Otherwise: `review_status=completed`, `approval_recommendation=approve`. Warnings do not block approval.
- Count issues still present in the current code, including those whose comment was skipped as a duplicate. Do not count issues that are already fixed.
- `reviewed_head_commit_sha` is the HEAD SHA from the prompt, unchanged.
- `review_summary` is one or two Korean sentences with the core reason.
