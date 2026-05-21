import shared from './shared'
import page from './page'
import student from './student'
import emergency from './emergency'
import details from './details'
import integrity from './integrity'
import remediation from './remediation'

export default {
  // Merge guardian copy at the Preschool module boundary so the pages can
  // resolve stable t('preschoolGuardiansPage.*') and related keys without
  // accidental double nesting.
  ...shared,
  ...page,
  ...student,
  ...emergency,
  ...details,
  ...integrity,
  ...remediation,
}
