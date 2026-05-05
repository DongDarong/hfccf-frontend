export default {
  sportMatchesManagement: {
    title: 'គ្រប់គ្រងការប្រកួត',
    subtitle: 'បង្កើតកាលវិភាគប្រកួត កែប្រែព័ត៌មានប្រកួតផ្ទាល់ និងបង្ហោះលទ្ធផល។',
    placeholder:
      'ទំព័រនេះនឹងប្រើសម្រាប់គ្រប់គ្រងកាលវិភាគ និងទិន្នន័យការប្រកួត។ នៅពេល Backend API រួចរាល់ សូមភ្ជាប់ទៅតារាង `sport_matches`។',
    toolbarEyebrow: 'ការគ្រប់គ្រងការប្រកួត',
    toolbarSummary: 'ការប្រកួត ({count})',
    visibleRange: 'បង្ហាញ {shown} ក្នុងចំណោម {total} ការប្រកួត',
    noResults: 'រកមិនឃើញការប្រកួតទេ។',
    spotlightLabel: 'កំពុងប្រកួត',
    summary: {
      total: {
        title: 'សរុបការប្រកួត',
        badge: 'បង្ហាញ {count} នៅពេលនេះ',
        caption: 'ការប្រកួតទាំងអស់ពី mock data បច្ចុប្បន្ន។',
      },
      live: {
        title: 'កំពុងប្រកួត',
        badge: 'កំពុងដំណើរការ',
        caption: 'ការប្រកួតដែលមានស្ថានភាព live នៅក្នុងបញ្ជីនេះ។',
      },
      scheduled: {
        title: 'បានកំណត់ពេល',
        badge: 'ការប្រកួតខាងមុខ',
        caption: 'ការប្រកួតដែលរង់ចាំដល់ថ្ងៃប្រកួត។',
      },
      completed: {
        title: 'បានបញ្ចប់',
        badge: 'លទ្ធផលរួចរាល់',
        caption: 'ការប្រកួតដែលបញ្ចប់រួចហើយ។',
      },
    },
    filters: {
      searchLabel: 'ស្វែងរក',
      searchPlaceholder: 'ស្វែងរកតាមក្រុម ទីលាន ឬលេខប្រកួត',
      competitionLabel: 'ការប្រកួតប្រជែង',
      competitionPlaceholder: 'ការប្រកួតប្រជែងទាំងអស់',
      tournamentLabel: 'ព្រឹត្តិការណ៍ប្រកួត',
      tournamentPlaceholder: 'ព្រឹត្តិការណ៍ទាំងអស់',
      matchDateLabel: 'កាលបរិច្ឆេទប្រកួត',
      matchDatePlaceholder: '',
    },
    table: {
      id: 'ID',
      homeTeam: 'ក្រុម​ម្ចាស់​ផ្ទះ',
      score: 'ពិន្ទុ',
      awayTeam: 'ក្រុម​ភ្ញៀវ',
      schedule: 'កាលវិភាគ',
      venue: 'ទីតាំង',
      status: 'ស្ថានភាព',
      actions: 'សកម្មភាព',
      empty: 'មិនមានការប្រកួតទេ។',
    },
    actions: {
      results: 'លទ្ធផល',
      edit: 'កែប្រែ',
      delete: 'លុប',
    },
    status: {
      scheduled: 'បានកំណត់ពេល',
      live: 'កំពុងប្រកួត',
      completed: 'បានបញ្ចប់',
      postponed: 'បានពន្យារ',
      cancelled: 'បានបោះបង់',
    },
  },
}
