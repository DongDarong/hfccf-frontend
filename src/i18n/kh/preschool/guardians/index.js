import shared from './shared'
import page from './page'
import student from './student'
import emergency from './emergency'

export default {
  // បញ្ចូលស្លាកអាណាព្យាបាលនៅកម្រិត Preschool module boundary ដើម្បីឲ្យ
  // EN/KH រក key ដូចគ្នាបានដោយគ្មាន double nesting។
  ...shared,
  ...page,
  ...student,
  ...emergency,
}
