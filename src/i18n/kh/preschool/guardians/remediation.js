// Keep Khmer remediation copy aligned with the EN file so parity tests pass
// and staff switching locale see the same label coverage.
export default {
  preschoolGuardianRemediation: {
    page: {
      title: 'មជ្ឈមណ្ឌលដោះស្រាយទិន្នន័យអាណាព្យាបាល',
      subtitle:
        'ពិនិត្យ និងដោះស្រាយបញ្ហាទិន្នន័យអាណាព្យាបាលដោយដៃ។ រាល់សកម្មភាពត្រូវបានកត់ត្រា និងមិនអាចត្រឡប់ក្រោយបានដោយគ្មានការបញ្ចូលដោះស្រាយថ្មី។',
      loadingIssues: 'កំពុងផ្ទុកបញ្ហាភាពត្រឹមត្រូវអាណាព្យាបាល...',
      noIssues: 'រកមិនឃើញបញ្ហាភាពត្រឹមត្រូវអាណាព្យាបាលទេ។',
    },
    tabs: {
      issues: 'បញ្ហាភាពត្រឹមត្រូវ',
      logs: 'កំណត់ត្រាដោះស្រាយ',
    },
    warning: {
      title: 'ត្រូវការសកម្មភាពដោយដៃ',
      body: 'សកម្មភាពនេះផ្លាស់ប្ដូរទិន្នន័យអាណាព្យាបាល ឬទំនាក់ទំនងដោយផ្ទាល់។ ពិនិត្យព័ត៌មានទាំងអស់ មុនពេលបញ្ជាក់។ រាល់សកម្មភាពត្រូវបានកត់ត្រាជាអចិន្ត្រៃយ៍ជាមួយគណនីអ្នកប្រើ។',
    },
    actions: {
      markReviewed: 'ចុះថ្ងៃពិនិត្យ',
      setPrimary: 'កំណត់ជាចម្បង',
      clearInvalidPrimary: 'លុបសញ្ញាចម្បងមិនត្រឹមត្រូវ',
      clearInvalidEmergencyContact: 'លុបស្លាកទំនាក់ទំនងបន្ទាន់',
      reconcileLegacyFields: 'ផ្សះផ្សាវាលទិន្នន័យចាស់',
      archiveOrphanGuardian: 'ទុកជាឯកសារអាណាព្យាបាលឯកកោ',
      archiveDuplicateCandidate: 'ទុកជាឯកសារទំនាក់ទំនងស្ទួន',
      refreshIssues: 'ផ្ទុកបញ្ហាឡើងវិញ',
      cancel: 'បោះបង់',
      confirm: 'បញ្ជាក់សកម្មភាព',
    },
    dialogTitles: {
      markReviewed: 'ចុះថ្ងៃពិនិត្យបញ្ហា',
      setPrimary: 'កំណត់អាណាព្យាបាលចម្បង',
      clearInvalidPrimary: 'លុបសញ្ញាចម្បងមិនត្រឹមត្រូវ',
      clearInvalidEmergencyContact: 'លុបស្លាកទំនាក់ទំនងបន្ទាន់',
      reconcileLegacyFields: 'ផ្សះផ្សាវាលអាណាព្យាបាលចាស់',
      archiveOrphanGuardian: 'ទុកជាឯកសារអាណាព្យាបាលឯកកោ',
      archiveDuplicateCandidate: 'ទុកជាឯកសារទំនាក់ទំនងស្ទួន',
    },
    dialogDescriptions: {
      markReviewed: 'កត់ត្រាថាបញ្ហានេះបានពិនិត្យ។ ទិន្នន័យនឹងមិនផ្លាស់ប្ដូរទេ។ ជំហានណែនាំ',
      setPrimary:
        'កំណត់ទំនាក់ទំនងនេះជាអាណាព្យាបាលចម្បងសម្រាប់សិស្ស។ សញ្ញាចម្បងផ្សេងទៀតទាំងអស់របស់សិស្សនេះនឹងត្រូវលុប។',
      clearInvalidPrimary:
        'ដកសញ្ញាចម្បងចេញពីទំនាក់ទំនងដែលបានទុកជាឯកសារ។ កំណត់ត្រាអាណាព្យាបាលនឹងមិនត្រូវបានលុបទេ។',
      clearInvalidEmergencyContact:
        'លុបស្លាកចម្បង ការយកទៅ និងបន្ទាន់ចេញពីទំនាក់ទំនងអសកម្ម។',
      reconcileLegacyFields:
        'សរសេរជាន់វាលចាស់ (guardian_name, guardian_phone) ដោយប្រើទិន្នន័យអាណាព្យាបាលចម្បងស្តង់ដាបច្ចុប្បន្ន។ សកម្មភាពនេះមិនអាចត្រឡប់ដោយស្វ័យប្រវត្តិ។',
      archiveOrphanGuardian:
        'ទុកជាឯកសារកំណត់ត្រាអាណាព្យាបាលនេះ។ អាចធ្វើបានតែប្រសិនបើគ្មានទំនាក់ទំនងសិស្ស។ កំណត់ត្រានឹងត្រូវបានរក្សា។',
      archiveDuplicateCandidate:
        'ទុកជាឯកសារទំនាក់ទំនងសិស្ស-អាណាព្យាបាលនេះ។ កំណត់ត្រាអាណាព្យាបាលមិនត្រូវបានលុប ឬបញ្ចូលគ្នាទេ។',
    },
    issueTypes: {
      studentNoActiveGuardian: 'សិស្សមិនមានអាណាព្យាបាលសកម្ម',
      multipleActivePrimaryGuardians: 'សិស្សមានអាណាព្យាបាលចម្បងច្រើន',
      archivedPrimaryRelationship: 'ទំនាក់ទំនងទុកជាឯកសារ នៅតែជាចម្បង',
      inactiveEmergencyContact: 'ទំនាក់ទំនងអសកម្មមានស្លាកទំនាក់ទំនង',
      pickupPermissionIssue: 'ទំនាក់ទំនងបន្ទាន់មិនអាចយកសិស្សបាន',
      legacyGuardianMismatch: 'វាលចាស់ខុសពីទិន្នន័យស្តង់ដារ',
      guardianWithoutStudents: 'អាណាព្យាបាលមិនភ្ជាប់នឹងសិស្ស',
      duplicateGuardianCandidate: 'អាណាព្យាបាលសង្ស័យស្ទួន',
    },
    issueDescriptions: {
      studentNoActiveGuardian: 'សិស្សនេះមិនមានទំនាក់ទំនងអាណាព្យាបាលសកម្មដែលបានស្តង់ដារទេ។',
      multipleActivePrimaryGuardians: 'សិស្សម្នាក់គួរមានអាណាព្យាបាលចម្បងសកម្មតែមួយប៉ុណ្ណោះ។',
      archivedPrimaryRelationship: 'សញ្ញាចម្បងគួរត្រូវបានដកចេញពេលទំនាក់ទំនងត្រូវបានទុកជាឯកសារ។',
      inactiveEmergencyContact: 'ទំនាក់ទំនងអសកម្មមិនគួរនៅជាចម្បង ឬជាទំនាក់ទំនងបន្ទាន់ទេ។',
      pickupPermissionIssue: 'ទំនាក់ទំនងបន្ទាន់គួរតែមានសិទ្ធិយកសិស្សបាននៅពេលសកម្ម។',
      legacyGuardianMismatch: 'វាលភាពឆបគ្នាលើកំណត់ត្រាសិស្សខុសពីអាណាព្យាបាលដែលបានស្តង់ដារ។',
      guardianWithoutStudents: 'កំណត់ត្រាអាណាព្យាបាលនេះមិនមានទំនាក់ទំនងសិស្ស។',
      duplicateGuardianCandidate: 'កំណត់ត្រាអាណាព្យាបាលនេះមានសញ្ញាស្ទួនជាមួយកំណត់ត្រាផ្សេង។',
    },
    labels: {
      student: 'សិស្ស',
      guardian: 'អាណាព្យាបាល',
      relationship: 'ទំនាក់ទំនង',
      notes: 'ចំណាំ',
      before: 'មុន',
      after: 'ក្រោយ',
      snapshots: 'ពាក្យថតចម្លងមុន / ក្រោយ',
      legacyDifferences: 'ភាពខុសគ្នាវាលចាស់',
    },
    placeholders: {
      notes: 'ចំណាំជាជម្រើសសម្រាប់សកម្មភាពដោះស្រាយ...',
    },
    table: {
      performedAt: 'ធ្វើនៅ',
      issueType: 'ប្រភេទបញ្ហា',
      action: 'សកម្មភាព',
      performedBy: 'ធ្វើដោយ',
      notes: 'ចំណាំ',
      snapshots: 'ពាក្យថតចម្លង',
      viewSnapshots: 'មើល',
      empty: 'រកមិនឃើញកំណត់ត្រាដោះស្រាយ។',
    },
    success: {
      markReviewed: 'បញ្ហាត្រូវបានចុះថ្ងៃពិនិត្យ។',
      setPrimary: 'អាណាព្យាបាលចម្បងត្រូវបានធ្វើបច្ចុប្បន្នភាព។',
      clearInvalidPrimary: 'សញ្ញាចម្បងមិនត្រឹមត្រូវត្រូវបានលុប។',
      clearInvalidEmergencyContact: 'ស្លាកទំនាក់ទំនងបន្ទាន់ត្រូវបានលុប។',
      reconcileLegacyFields: 'វាលចាស់ត្រូវបានផ្សះផ្សាពីទិន្នន័យស្តង់ដារ។',
      archiveOrphanGuardian: 'អាណាព្យាបាលឯកកោត្រូវបានទុកជាឯកសារ។',
      archiveDuplicateCandidate: 'ទំនាក់ទំនងស្ទួនត្រូវបានទុកជាឯកសារ។',
    },
    errors: {
      loadLogsFailed: 'ផ្ទុកកំណត់ត្រាដោះស្រាយមិនបានទេ។',
      actionFailed: 'សកម្មភាពដោះស្រាយបានបរាជ័យ។ សូមពិនិត្យព័ត៌មាន ហើយព្យាយាមម្ដងទៀត។',
    },
  },
}
