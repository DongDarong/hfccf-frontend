<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Loading from '@/components/feedback/Loading.vue'
import ProductForm from '@/modules/products/components/ProductForm.vue'
import { useProductForm } from '@/modules/products/composables/useProductForm'
import { getProduct, updateProduct } from '@/modules/products/services/productService'

defineOptions({
  name: 'ProductEditPage',
})

const route = useRoute()
const router = useRouter()
const pageLoading = ref(false)
const saving = ref(false)
const loadError = ref('')
const requestError = ref('')
const product = ref(null)
const productForm = useProductForm()

function updateFormField({ field, value }) {
  productForm.form[field] = value
}

async function loadProduct(productId) {
  pageLoading.value = true
  loadError.value = ''
  requestError.value = ''

  try {
    const response = await getProduct(productId)
    product.value = response.data
    productForm.reset(response.data)
  } catch (error) {
    product.value = null
    loadError.value = error.message || 'Unable to load the product for editing.'
  } finally {
    pageLoading.value = false
  }
}

async function handleSubmit() {
  requestError.value = ''
  productForm.clearValidationErrors()

  if (!productForm.validate()) {
    return
  }

  saving.value = true

  try {
    const response = await updateProduct(route.params.id, productForm.toPayload())
    const nextProductId = response.data?.id || route.params.id

    await router.push({
      name: 'products-details',
      params: { id: nextProductId },
      query: { status: 'updated' },
    })
  } catch (error) {
    productForm.setValidationErrors(error.validationErrors)
    requestError.value = error.message || 'Unable to update the product.'
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  router.push({
    name: 'products-details',
    params: { id: route.params.id },
  })
}

watch(
  () => route.params.id,
  (productId) => {
    if (!productId) return
    loadProduct(productId)
  },
  { immediate: true },
)
</script>

<template>
  <MainLayout>
    <section class="flex flex-col gap-5">
      <HeaderSection
        title="Edit Product"
        subtitle="Load the product from Laravel, preserve the response envelope, and submit updates through the shared API layer."
      />

      <div
        v-if="pageLoading"
        class="rounded-[1.4rem] border border-surface-200 bg-white px-4 py-12 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]"
      >
        <Loading label="Loading product" size="md" />
      </div>

      <div
        v-else-if="loadError"
        class="flex flex-col gap-3 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-700 lg:flex-row lg:items-center lg:justify-between"
      >
        <span>{{ loadError }}</span>
        <div class="flex flex-wrap gap-3">
          <Button type="button" variant="outline" size="sm" @click="loadProduct(route.params.id)">
            Retry
          </Button>
          <Button type="button" variant="ghost" size="sm" @click="router.push({ name: 'products-list' })">
            Back to list
          </Button>
        </div>
      </div>

      <ProductForm
        v-else
        :form="productForm.form"
        :errors="productForm.validationErrors"
        :loading="saving"
        :title="product?.name ? `Editing ${product.name}` : 'Edit product'"
        description="The form reuses the same validation rules as product creation and submits via PUT /api/products/{id}."
        submit-text="Save changes"
        cancel-text="Back to details"
        :request-error="requestError"
        @update:form="updateFormField"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </section>
  </MainLayout>
</template>
