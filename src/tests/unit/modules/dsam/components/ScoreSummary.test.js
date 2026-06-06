import { describe, it, expect } from 'vitest'
import { mountWithPlugins } from '../../../../helpers/mount'
import ScoreSummary from '@/modules/dsam/components/shared/ScoreSummary.vue'

const messages = {
  en: {
    dsamShared: {
      riskLevels: {
        low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
      },
      score: {
        overallScore: 'Overall Score',
        section:      'Section',
      },
    },
  },
}

function mount(submission = {}) {
  return mountWithPlugins(ScoreSummary, {
    props: { submission },
    messages,
  })
}

describe('ScoreSummary', () => {
  // overall score label
  it('renders the overall score label', () => {
    const wrapper = mount({ score_percentage: 75 })
    expect(wrapper.text()).toContain('Overall Score')
  })

  // score_percentage display
  it('renders formatted score_percentage', () => {
    const wrapper = mount({ score_percentage: 82.5 })
    expect(wrapper.text()).toContain('82.5%')
  })

  it('renders dash when score_percentage is null', () => {
    const wrapper = mount({ score_percentage: null })
    expect(wrapper.text()).toContain('—')
  })

  // total / max score
  it('renders total_score and max_possible_score', () => {
    const wrapper = mount({ score_percentage: 80, total_score: 40, max_possible_score: 50 })
    expect(wrapper.text()).toContain('40.0')
    expect(wrapper.text()).toContain('50.0')
  })

  it('renders dash for missing total_score', () => {
    const wrapper = mount({ score_percentage: 80, total_score: null, max_possible_score: 50 })
    expect(wrapper.text()).toContain('—')
  })

  // RiskBadge integration
  it('renders RiskBadge with submission risk_level', () => {
    const wrapper = mount({ score_percentage: 60, risk_level: 'high' })
    expect(wrapper.text()).toContain('High')
  })

  it('renders RiskBadge fallback when no risk_level', () => {
    const wrapper = mount({ score_percentage: 60 })
    expect(wrapper.text()).toContain('—')
  })

  // section scores
  it('renders section score bars when scores are present', () => {
    const submission = {
      score_percentage: 75,
      scores: [
        { id: 1, section: { title: 'Motor Skills' }, percentage: 80 },
        { id: 2, section: { title: 'Cognitive'    }, percentage: 60 },
      ],
    }
    const wrapper = mount(submission)
    expect(wrapper.text()).toContain('Motor Skills')
    expect(wrapper.text()).toContain('Cognitive')
    expect(wrapper.text()).toContain('80%')
    expect(wrapper.text()).toContain('60%')
  })

  it('uses fallback section label when section title is missing', () => {
    const submission = {
      score_percentage: 75,
      scores: [{ id: 1, section: null, percentage: 50 }],
    }
    const wrapper = mount(submission)
    expect(wrapper.text()).toContain('Section')
  })

  it('renders no score bars when scores array is empty', () => {
    const wrapper = mount({ score_percentage: 75, scores: [] })
    expect(wrapper.findAll('.bg-blue-500')).toHaveLength(0)
  })

  it('renders no score bars when scores is absent', () => {
    const wrapper = mount({ score_percentage: 75 })
    expect(wrapper.findAll('.bg-blue-500')).toHaveLength(0)
  })
})
