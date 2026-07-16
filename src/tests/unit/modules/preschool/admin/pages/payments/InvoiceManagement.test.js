import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import InvoiceManagement from '@/modules/preschool/admin/pages/payments/InvoiceManagement.vue'
import {
  cancelPreschoolInvoice,
  createPreschoolInvoice,
  deletePreschoolInvoice,
  downloadPreschoolInvoiceExport,
  fetchPreschoolInvoice,
  fetchPreschoolInvoices,
  updatePreschoolInvoice,
} from '@/modules/preschool/services/api/preschoolPaymentApi'
import { fetchPreschoolClasses, fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'
import {
  fetchFeeTypes,
  fetchPaymentSettings,
} from '@/modules/preschool/services/api/preschoolPaymentConfigurationApi'

const pushMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: vi.fn(),
  fetchPreschoolStudents: vi.fn(),
}))

vi.mock('@/modules/preschool/services/api/preschoolPaymentApi', () => ({
  cancelPreschoolInvoice: vi.fn(),
  createPreschoolInvoice: vi.fn(),
  deletePreschoolInvoice: vi.fn(),
  downloadPreschoolInvoiceExport: vi.fn(),
  fetchPreschoolInvoice: vi.fn(),
  fetchPreschoolInvoices: vi.fn(),
  updatePreschoolInvoice: vi.fn(),
}))

vi.mock('@/modules/preschool/services/api/preschoolPaymentConfigurationApi', () => ({
  fetchFeeTypes: vi.fn(),
  fetchPaymentSettings: vi.fn(),
}))

function stubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    PaymentSummaryCards: { template: '<div />' },
    PaymentFilters: { template: '<div />' },
    PaymentToolbar: {
      props: ['eyebrow', 'title', 'clearLabel', 'addLabel'],
      emits: ['clear', 'add'],
      template: '<div><button type="button" class="add-btn" @click="$emit(\'add\')">{{ addLabel }}</button></div>',
    },
    Pagination: { template: '<div />' },
    Dialog: {
      inheritAttrs: false,
      props: ['visible'],
      template: '<div v-if="visible" v-bind="$attrs"><slot /><slot name="footer" /></div>',
    },
    Button: {
      inheritAttrs: false,
      props: ['loading', 'disabled'],
      emits: ['click'],
      template: '<button v-bind="$attrs" :disabled="disabled || loading" @click="$emit(\'click\')"><slot /></button>',
    },
    AlertQuestion: { template: '<div />' },
    AlertSuccess: { template: '<div />' },
    InvoiceTable: {
      emits: ['view', 'edit', 'delete', 'cancel', 'download-pdf', 'download-excel', 'add-payment'],
      template: '<div><button type="button" class="row-add-payment" @click="$emit(\'add-payment\', { id: 42, status: \'issued\', balanceDue: 25 })">Add payment</button></div>',
    },
  }
}

describe('InvoiceManagement', () => {
  beforeEach(() => {
    pushMock.mockReset()
    fetchPreschoolClasses.mockResolvedValue({
      items: [
        { id: 7, code: 'A1', name: 'Class A1', status: 'active' },
      ],
    })
    fetchPreschoolStudents.mockResolvedValue({
      items: [
        { id: 1, fullName: 'Alice Student', studentType: 'paying' },
      ],
    })
    fetchPreschoolInvoices.mockResolvedValue({
      items: [
        {
          id: 42,
          invoiceNumber: 'INV-20260716-0001',
          studentId: 1,
          classId: 7,
          totalAmount: 50,
          paidAmount: 25,
          balanceDue: 25,
          status: 'issued',
        },
      ],
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    })
    fetchPaymentSettings.mockResolvedValue({ invoicePrefix: 'INV', nextInvoiceNumber: 1 })
    fetchFeeTypes.mockResolvedValue({ items: [{ name: 'Registration fee', defaultAmount: 25 }] })
    createPreschoolInvoice.mockResolvedValue({ id: 100 })
    updatePreschoolInvoice.mockResolvedValue({ id: 42 })
    deletePreschoolInvoice.mockResolvedValue({})
    cancelPreschoolInvoice.mockResolvedValue({})
    downloadPreschoolInvoiceExport.mockResolvedValue({ blob: new Blob(['x']), filename: 'invoice.pdf' })
    fetchPreschoolInvoice.mockResolvedValue(null)
  })

  it('keeps invoice creation on the dedicated invoice page', async () => {
    const wrapper = mountWithPlugins(InvoiceManagement, {
      messages: { en: enPreschool },
      global: { stubs: stubs() },
    })

    await flushPromises()

    const createButton = wrapper.find('.add-btn')
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    await flushPromises()

    expect(wrapper.find('#invoice-number').exists()).toBe(true)
  })

  it('routes add payment actions back to the primary payment flow', async () => {
    const wrapper = mountWithPlugins(InvoiceManagement, {
      messages: { en: enPreschool },
      global: { stubs: stubs() },
    })

    await flushPromises()

    await wrapper.find('.row-add-payment').trigger('click')
    await flushPromises()

    expect(pushMock).toHaveBeenCalledWith({
      name: 'dashboard-preschool-admin-payment',
      query: { invoiceId: 42 },
    })
  })
})
