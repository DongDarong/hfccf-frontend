<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import ProductForm from '@/modules/products/components/ProductForm.vue'
import { useProductForm } from '@/modules/products/composables/useProductForm'
import { createProduct } from '@/modules/products/services/productService'

defineOptions({
  name: 'ProductCreatePage',
})

const router = useRouter()
const loading = ref(false)
const requestError = ref('')
const productForm = useProductForm()

function updateFormField({ field, value }) {
  productForm.form[field] = value
}

async function handleSubmit() {
  requestError.value = ''
  productForm.clearValidationErrors()

  if (!productForm.validate()) {
    return
  }

  loading.value = true

  try {
    const response = await createProduct(productForm.toPayload())
    const createdProductId = response.data?.id

    await router.push({
      name: createdProductId ? 'products-details' : 'products-list',
      params: createdProductId ? { id: createdProductId } : undefined,
      query: { status: 'created' },
    })
  } catch (error) {
    productForm.setValidationErrors(error.validationErrors)
    requestError.value = error.message || 'Unable to create the product.'
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.push({ name: 'products-list' })
}
</script>

<template>
  <MainLayout>
    <section class="flex flex-col gap-5">
      <HeaderSection
        title="Create Product"
        subtitle="Send a real POST request to Laravel and keep the form aligned with the backend validation contract."
      />

      <ProductForm
        :form="productForm.form"
        :errors="productForm.validationErrors"
        :loading="loading"
        title="New product"
        description="Required fields match the Laravel API: name, price, and stock. Description is optional."
        submit-text="Create product"
        cancel-text="Back to products"
        :request-error="requestError"
        @update:form="updateFormField"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </section>
  </MainLayout>
</template>
