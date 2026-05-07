# Codex Working Rules

This file defines the conditions Codex should follow when generating code or creating new files in this repository.

## 1. When Code May Be Generated

- Generate code only when the request is explicit or the task clearly requires an implementation.
- Prefer fixing or extending existing files before creating new ones.
- Do not invent new abstractions when an existing component, composable, or utility can be reused.
- Keep changes aligned with the current frontend contract, mock data structure, and SQL schema.
- Add comments for important logic blocks, non-obvious conditions, and state transitions.

## 2. Required Project Conventions

- Use PrimeVue for UI components whenever possible.
- Use Tailwind CSS for layout, spacing, and responsive styling.
- Use i18n for all user-facing text. Do not hardcode labels, placeholders, or alerts.
- Keep mock data in `src/mocks/` when the feature is frontend-driven.
- Preserve existing route names, role codes, and domain codes unless the task explicitly requires a change.
- Keep players, coaches, staff, and system users separate when the domain model treats them separately.

## 3. File Creation Rules

- Create a new file only if no existing file in the current feature area can be safely extended.
- New files must follow the current module structure and naming convention.
- Do not create files outside the feature area unless the task is clearly cross-cutting.
- When creating a file, inspect the nearest existing nodes first:
  - page node
  - component node
  - shared component node
  - i18n node
  - mock data node
  - database schema node

## 4. Preferred Nodes To Inspect Before Creating Files

- `src/modules/<domain>/pages/`
- `src/modules/<domain>/components/`
- `src/components/`
- `src/i18n/en/`
- `src/i18n/kh/`
- `src/mocks/`
- `database_table.sql`

Use the smallest valid scope first. For example:

- If the task is a page UI change, inspect the page and its local components first.
- If the task is a reusable widget, inspect the module component folder before using shared components.
- If the task needs new labels, inspect the matching i18n files before writing template text.
- If the task touches data fields, inspect `database_table.sql` before changing the frontend model.

## 5. Safe Generation Checklist

- Confirm the target folder already exists.
- Match the current feature naming style.
- Keep components small and single-purpose.
- Avoid duplicating existing UI logic.
- Update English and Khmer i18n keys together.
- Run lint after structural or template changes when practical.

## 6. Database and Contract Alignment

- Treat `database_table.sql` as the source of truth for field names and relations.
- Preserve frontend-compatible string IDs and role codes.
- If a field is intentionally denormalized, document it in the schema or code comment.
- If a new UI field needs persistence later, add the schema note now and keep the frontend mapper clear.

