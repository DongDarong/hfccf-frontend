import api from '@/services/api'

export const assessmentQuestionTypeApi = {
  list: () => api.get('/assessment/question-types'),
}
