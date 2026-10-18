# PR review rules

Rules for the Claude PR review. Review comments are written in Korean.

## Scope

- Review only changed files under `frontend/`.
- Skip lockfiles, generated files, binaries and `.github/`.

## Execution order

`{PR_NUMBER}` and `{RULES_DIR}` are given in the prompt.

1. Gather info in parallel:
   - `gh pr diff {PR_NUMBER}`
   - `gh pr view {PR_NUMBER}`
   - existing inline comments: `gh api "repos/$GITHUB_REPOSITORY/pulls/{PR_NUMBER}/comments" --paginate`
   - existing issue comments: `gh api "repos/$GITHUB_REPOSITORY/issues/{PR_NUMBER}/comments" --paginate`
2. Read `{RULES_DIR}/frontend/CLAUDE.md`, then the `react-best-practices` and `nextjs` skills it points to under `{RULES_DIR}/frontend/.claude/skills/`. Read in parallel only the rule files relevant to the changed code.
3. Read surrounding code with Read, Glob and Grep when the diff alone is not enough.
4. Collect all candidate issues first, then rank them by severity and keep the top 10. Do not write comments in this step.
5. Write the comments in parallel with `mcp__github_inline_comment__create_inline_comment`.

## Severity

- CRITICAL: must be fixed before merge (bug, type safety, security, broken build).
- WARNING: recommended fix. Never blocks approval.

Project-specific CRITICAL cases (verified build failures or explicit project bans):

- Barrel files (`index.ts` that only re-exports) and re-exports. The project forbids them. Imports must point to each file directly.
- Seed dotted access (for example `TextField.Root`) in a file without `"use client"`.

FSD layer rules and Seed usage are defined in the frontend sources. Follow them as they are and do not restate them.

## Comment format

Write each comment in Korean, inline on the exact diff line.

````
**[CRITICAL|WARNING]** rule name

**문제**: why this code is a problem, briefly.

**제안**:
```tsx
// corrected code
```

**근거**: `skill file path` > rule name
````

The basis line must cite the skill file and the rule the comment is derived from.

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
