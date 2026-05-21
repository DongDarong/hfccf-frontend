import shared from './shared'
import page from './page'
import student from './student'
import emergency from './emergency'
import details from './details'
import integrity from './integrity'
import remediation from './remediation'
import governance from './governance'

export default {
  // Keep the Khmer guardian module split into small files so the page copy
  // stays readable and the EN/KH nesting contract remains identical.
  ...shared,
  ...page,
  ...student,
  ...emergency,
  ...details,
  ...integrity,
  ...remediation,
  ...governance,
}
