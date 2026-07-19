# Sport Module — Action Plan for Quality Improvements
## Focus: Fix & Refine Existing Code (No New Features)

**Date:** 2026-07-20  
**Philosophy:** Make what's there better  
**Total Estimated Work:** 10-15 hours

---

## Priority 1: CRITICAL FIXES (Must Do This Week)

### Fix #1: Coach Form Avatar Removal Logic
**File:** `src/modules/sport/admin/pages/forms/AddCoach/utils/addCoachHelpers.ts` (Line 58)  
**Time:** 10 minutes  
**Current:**
```javascript
removeAvatar: !form.profileImage ? false : false,  // Always false ❌
```
**Fix:**
```javascript
removeAvatar: !form.profileImage,  // Correct logic ✅
```
**Verification:**
- Test uploading coach photo
- Test removing coach photo  
- Verify photo is deleted in admin list

---

### Fix #2: Internationalize Hardcoded Error Messages
**Files:** 12 files with hardcoded messages  
**Time:** 3 hours  
**Impact:** Enables full Khmer support

#### Step 1: Create i18n Keys File
**File:** `src/i18n/en/sport/admin/shared-messages.js`  
```javascript
export default {
  errors: {
    assignmentExists: 'An active assignment already exists for this coach and team',
    loadingFailed: 'Unable to load data',
    savingFailed: 'Unable to save changes',
    loadingPlayers: 'Unable to load players',
    savingResult: 'Unable to save match result',
    loadingCoaches: 'Unable to load coaches',
  },
  success: {
    created: '{itemType} created successfully',
    updated: '{itemType} updated successfully',
    deleted: '{itemType} deleted successfully',
  },
  confirmations: {
    deleteItem: 'Are you sure you want to delete "{itemName}"?',
  },
}
```

**File:** `src/i18n/kh/sport/admin/shared-messages.js`  
```javascript
export default {
  errors: {
    assignmentExists: 'មានការផ្តល់ជូនសកម្មភាពដែល왁ក្តាប់រួចហើយសម្រាប់គ្រូបង្ហាត់និងក្រុម',
    loadingFailed: 'បរាជ័យក្នុងការផ្ទុកទិន្នន័យ',
    // ... rest of Khmer translations
  },
}
```

#### Step 2: Update Files with Hardcoded Messages
**Files to Fix:**
1. `AddPlayingStyle.vue` — Success messages
2. `CoachTeamAssignments.vue` — Assignment exists error
3. `usePlayerLifecycle.js` — Multiple error messages
4. `useMatchResultEntry.js` — Match result errors
5. `useSportApprovals.js` — Approval errors
6. `DivisionManagement.vue` — Delete confirmation
7. `PlayingStyleManagement.vue` — Delete confirmation
8. `AddDivision.vue` — Form errors
9. `PendingPlayerApprovals.vue` — Rejection reason

**Pattern to Follow:**
```javascript
// Import composable at top
import { useLanguage } from '@/composables/useLanguage'

// Inside component/composable
const { t } = useLanguage()

// Replace hardcoded string
// Old: error.value = 'An active assignment already exists for this coach and team'
// New:
error.value = t('sportSharedMessages.errors.assignmentExists')
```

---

### Fix #3: Replace window.confirm/alert with Dialogs
**Files:** 3 files using deprecated APIs  
**Time:** 1.5 hours  
**Pattern:** Already used in other pages (AddPlayingStyle.vue)

#### Files to Fix:
1. `DivisionManagement.vue` (Lines 91-100)
2. `PlayingStyleManagement.vue` (Lines 91-102)  
3. `AddDivision.vue` (Lines 68, 89)

#### Fix Pattern:
```javascript
// Old (Blocking):
if (window.confirm(`Are you sure you want to delete "${division.name}"?`)) {
  await deleteDivision(division.id)
}

// New (Non-blocking, using existing component):
const confirmDelete = async () => {
  const confirmed = await AlertQuestion({
    title: t('divisions.confirmDelete'),
    message: t('divisions.deleteMessage', { name: division.name }),
    okText: t('common.delete'),
    cancelText: t('common.cancel'),
  })
  
  if (confirmed) {
    await deleteDivision(division.id)
  }
}
```

---

## Priority 2: CODE QUALITY IMPROVEMENTS (Next 1-2 Weeks)

### Fix #4: Clean Up Debug Logging
**Files:** SportAttendanceIdCard.vue, idCardHelpers.ts  
**Time:** 30 minutes  
**Action:** Remove or properly log console.warn/error statements

**Files with console logs:**
- `SportAttendanceIdCard.vue` (Lines 116, 127, 138, 146)
- `idCardHelpers.ts` (Lines 60, 69)

**Decision:** For now, remove debug logs
```javascript
// Remove:
console.log('Generating ID card for', playerId)
console.warn('Photo failed for', player)

// Alternative (if needed for production monitoring):
// Use error tracking service like Sentry
// captureException(error, { context: 'id-card-generation' })
```

---

### Fix #5: Reduce Excessive 'any' Type Usage
**Files:** 8 utility and composable files  
**Time:** 3-4 hours  
**Benefit:** Better TypeScript type safety, IDE support

#### Files with 'any' (Priority Order):
1. `AddCoach/utils/addCoachHelpers.ts` — 4 instances
2. `AddPlayer/utils/addPlayerHelpers.ts` — 3 instances
3. `AddTeam/utils/addTeamHelpers.ts` — 4 instances
4. `AddCoach/composables/useCoachProfileImage.ts` — 2 instances
5. `AddPlayer/composables/useProfileImage.ts` — 2 instances
6. `AddTeam/composables/useTeamLogo.ts` — 2 instances
7. `AddMatch/utils/addMatchHelpers.ts` — 1 instance
8. `MatchesResultEntry/utils/resultEntryHelpers.ts` — 1 instance

#### Fix Pattern:
```typescript
// Old (Weak type safety):
function buildCoachPayload(form: any): any {
  return {
    name: form.name,
    email: form.email,
  }
}

// New (Strong type safety):
interface CoachFormData {
  name: string
  email: string
  profileImage?: File
  status: 'active' | 'inactive'
}

interface CoachPayload {
  name: string
  email: string
  profile_image?: string
  status: string
}

function buildCoachPayload(form: CoachFormData): CoachPayload {
  return {
    name: form.name,
    email: form.email,
    profile_image: form.profileImage ? URL.createObjectURL(form.profileImage) : undefined,
    status: form.status,
  }
}
```

**Create Interface Files:**
- `src/modules/sport/admin/pages/forms/AddCoach/types/coachForm.ts`
- `src/modules/sport/admin/pages/forms/AddPlayer/types/playerForm.ts`
- `src/modules/sport/admin/pages/forms/AddTeam/types/teamForm.ts`
- `src/modules/sport/admin/pages/forms/AddMatch/types/matchForm.ts`

---

### Fix #6: Normalize Error Handling Patterns
**Files:** All management pages  
**Time:** 2 hours  
**Goal:** Consistent error/success feedback

#### Pattern to Use Consistently:
```javascript
// Use AlertError for failures
import { AlertError, AlertSuccess } from '@/components/dialogs'

const deleteItem = async (id) => {
  try {
    loading.value = true
    await api.delete(id)
    
    // Show success
    items.value = items.value.filter(i => i.id !== id)
    
    // Show confirmation
    await AlertSuccess({
      title: t('common.success'),
      message: t('management.itemDeleted'),
    })
  } catch (error) {
    // Show error
    await AlertError({
      title: t('common.error'),
      message: t('management.deleteError'),
    })
  } finally {
    loading.value = false
  }
}
```

---

## Priority 3: ACCESSIBILITY ENHANCEMENTS (Parallel Work)

### Fix #7: Tournament Module Accessibility
**Severity:** Critical compliance issue  
**Time:** 3-5 days  
**Scope:** 8 pages + 11 composables

#### Tournament Pages Needing a11y Work:
1. TournamentListPage.vue
2. TournamentDetailPage.vue
3. TournamentGroupsPage.vue
4. TournamentFixturesPage.vue
5. TournamentKnockoutPage.vue
6. TournamentResultsPage.vue
7. TournamentStandingsPage.vue
8. TournamentCreatePage.vue

#### Quick Wins (Start Here):
- Add `aria-label` to all interactive elements
- Use semantic HTML (nav, article, section)
- Add `role` attributes where needed
- Ensure keyboard navigation works

#### Example Fix:
```html
<!-- Before (not accessible): -->
<div class="bracket" @click="openMatch(match)">
  {{ match.home }} vs {{ match.away }}
</div>

<!-- After (accessible): -->
<button
  class="bracket-match"
  @click="openMatch(match)"
  :aria-label="`Match: ${match.home} vs ${match.away}, ${match.date}`"
  role="button"
>
  {{ match.home }} vs {{ match.away }}
</button>
```

---

## Priority 4: HOUSEKEEPING (Low Impact, High Value)

### Fix #8: Normalize Line Endings
**Files:** 8 files  
**Time:** 10 minutes  
**Action:** Run git normalization

```bash
# Add .gitattributes
echo "* text=auto
*.vue text eol=lf
*.js text eol=lf
*.ts text eol=lf
*.json text eol=lf" >> .gitattributes

# Normalize existing files
git add -A
git commit -m "fix: normalize line endings (CRLF → LF)"
```

---

### Fix #9: Rename Misspelled Directory
**Path:** `src/modules/sport/admin/pages/list/ManagesPlayerInfor/`  
**Time:** 15 minutes  
**Action:** Rename to `ManagePlayerInformation`

```bash
git mv src/modules/sport/admin/pages/list/ManagesPlayerInfor \
        src/modules/sport/admin/pages/list/ManagePlayerInformation

git commit -m "refactor: fix directory name (ManagesPlayerInfor → ManagePlayerInformation)"
```

---

### Fix #10: Commit Untracked Files
**Time:** 30 minutes  
**Action:** Verify and commit new components and tests

**Files to Commit:**
```bash
git add src/modules/sport/coach/components/CoachDashboardActions.vue
git add src/modules/sport/coach/components/CoachNextTrainingCard.vue
git add src/modules/sport/coach/components/CoachTeamOverview.vue
git add src/modules/sport/composables/useSportEquipmentAssignments.js
git add src/modules/sport/tournament/components/detail/TournamentTeamManagement.vue
git add src/modules/sport/tournament/composables/useTournamentTeams.js

# Commit with descriptive message
git commit -m "feat(sport): add coach dashboard components and equipment composable"

# Do same for tests (separate commit)
git add src/tests/unit/modules/sport/
git commit -m "test(sport): add comprehensive test coverage for admin and coach pages"
```

---

## Implementation Timeline

### Week 1 (This Week)
- [ ] Day 1: Fix avatar removal logic (Fix #1) — 10 min
- [ ] Day 1-2: Internationalize hardcoded messages (Fix #2) — 3 hours
- [ ] Day 2-3: Replace window.confirm/alert (Fix #3) — 1.5 hours
- [ ] Day 3: Clean up debug logging (Fix #4) — 30 min
- [ ] Day 4: Housekeeping (Fix #8, #9, #10) — 1 hour
- [ ] **Subtotal: 6 hours**

### Week 2-3
- [ ] Reduce 'any' types (Fix #5) — 3-4 hours
- [ ] Normalize error handling (Fix #6) — 2 hours
- [ ] **Subtotal: 5-6 hours**

### Week 3-4 (Parallel: Async Task)
- [ ] Tournament accessibility (Fix #7) — 3-5 days
- [ ] **Note:** Can be done in parallel while others work on fixes

### Total Estimated: 10-15 hours of development

---

## Verification Checklist

After each fix, verify:

### Fix #1 (Avatar Logic)
- [ ] Upload coach photo
- [ ] Remove photo successfully
- [ ] Verify photo deleted on list page
- [ ] Test edge cases (no photo, multiple uploads)

### Fix #2 (i18n)
- [ ] Test in English language — all messages display
- [ ] Test in Khmer language — all messages display
- [ ] No missing i18n key warnings in console
- [ ] Verbs correctly conjugated in both languages

### Fix #3 (Dialogs)
- [ ] Delete confirmation appears as modal (not blocking)
- [ ] Can cancel deletion
- [ ] Can proceed with deletion
- [ ] Escape key closes dialog
- [ ] Dialog accessible via keyboard

### Fix #4 (Logging)
- [ ] No console.log/warn/error in ID card generation
- [ ] Errors still handled gracefully
- [ ] ID card generation works end-to-end

### Fix #5 (TypeScript)
- [ ] TypeScript compiler shows no errors
- [ ] IDE autocomplete works for form objects
- [ ] Tests still pass

### Fix #6 (Error Handling)
- [ ] All errors show AlertError dialog
- [ ] All successes show AlertSuccess dialog
- [ ] Consistent styling across all pages
- [ ] Messages are i18n'd

### Fix #7 (Accessibility)
- [ ] Screen reader (NVDA/JAWS) can navigate tournament pages
- [ ] Keyboard-only navigation works (Tab, Enter, Escape)
- [ ] Bracket matches are announced with proper context
- [ ] Fixture groups are announced semantically
- [ ] WCAG 2.1 AA compliance verified

---

## Git Workflow

```bash
# Create feature branch
git checkout -b fix/sport-module-quality

# Make fixes
# Commit each logical fix separately

git commit -m "fix(sport): correct avatar removal logic in coach form"
git commit -m "fix(sport): internationalize hardcoded error messages"
git commit -m "fix(sport): replace deprecated window.confirm/alert with dialogs"
git commit -m "fix(sport): remove debug logging from ID card generation"
git commit -m "refactor(sport): reduce excessive 'any' type usage in forms"
git commit -m "refactor(sport): normalize error handling patterns"
git commit -m "fix(sport): normalize line endings (CRLF → LF)"
git commit -m "refactor(sport): rename misspelled directory"
git commit -m "feat(sport): commit untracked coach components and tests"

# Create pull request
git push origin fix/sport-module-quality
# Open PR on GitHub
```

---

## Testing Commands

After implementation:

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Test
npm run test:run

# Build
npm run build

# Verify no console errors
npm run dev
# Navigate to each admin page and check DevTools console
```

---

## Success Criteria

✅ All fixes implemented  
✅ No TypeScript errors  
✅ No ESLint errors  
✅ All tests passing  
✅ i18n keys working in EN and KH  
✅ No console errors in admin section  
✅ Tournament section passes WCAG 2.1 AA accessibility audit  
✅ Git history is clean with logical commits  

---

## Notes for Implementation

**Who Should Do What:**
- **Fix #1-4**: Any developer (30 min to 2 hours)
- **Fix #5**: Intermediate developer (3-4 hours, requires TypeScript)
- **Fix #6**: Any developer familiar with error handling (2 hours)
- **Fix #7**: Accessibility specialist or designer (3-5 days)
- **Fix #8-10**: Any developer (1 hour total)

**Tools Needed:**
- VS Code with ESLint plugin
- TypeScript compiler
- Screen reader (NVDA or JAWS) for accessibility testing
- Chrome DevTools for console errors

**References:**
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- Vue 3 TypeScript: https://vuejs.org/guide/typescript/
- i18n Best Practices: Check project's existing i18n patterns

---

**Prepared by:** Frontend Architecture Review  
**Date:** 2026-07-20  
**Status:** Ready for Implementation  
**Next Step:** Start with Priority 1 fixes (4-5 hours of quick wins)

