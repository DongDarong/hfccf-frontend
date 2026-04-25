<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import ProductTable from '@/modules/products/components/ProductTable.vue'
import {
  createDefaultPagination,
  deleteProduct,
  listProducts,
} from '@/modules/products/services/productService'

defineOptions({
  name: 'ProductListPage',
})

const route = useRoute()
const router = useRouter()
const products = ref([])
const pagination = ref(createDefaultPagination())
const loading = ref(false)
const deleteLoading = ref(false)
const requestError = ref('')
const feedbackMessage = ref('')
const productPendingDelete = ref(null)

const routeStatusMessage = computed(() => {
  if (route.query.status === 'deleted') {
    return 'Product deleted successfully.'
  }

  return ''
})

const visibleFeedbackMessage = computed(() => {
  return String(feedbackMessage.value || routeStatusMessage.value || '').trim()
})

const deleteDialogVisible = computed(() => Boolean(productPendingDelete.value))

function parsePage(value) {
  const normalized = Number.parseInt(String(value ?? '1'), 10)
  return Number.isInteger(normalized) && normalized > 0 ? normalized : 1
}

const currentPage = computed(() => parsePage(route.query.page))

async function loadProducts(page = currentPage.value) {
  loading.value = true
  requestError.value = ''

  try {
    const response = await listProducts({ page })
    products.value = response.data.products
    pagination.value = response.data.pagination
  } catch (error) {
    products.value = []
    pagination.value = createDefaultPagination()
    requestError.value = error.message || 'Unable to load products.'
  } finally {
    loading.value = false
  }
}

async function goToPage(page) {
  const normalizedPage = Math.max(1, Number(page) || 1)
  const nextQuery = normalizedPage > 1 ? { page: String(normalizedPage) } : {}

  if (
    currentPage.value === normalizedPage &&
    String(route.query.status || '').trim() === ''
  ) {
    await loadProducts(normalizedPage)
    return
  }

  await router.push({ name: 'products-list', query: nextQuery })
}

function clearRouteStatus() {
  if (!route.query.status) return
  router.replace({
    name: 'products-list',
    query: currentPage.value > 1 ? { page: String(currentPage.value) } : {},
  })
}

function openDeleteDialog(product) {
  feedbackMessage.value = ''
  productPendingDelete.value = product
}

function closeDeleteDialog() {
  productPendingDelete.value = null
}

async function confirmDelete() {
  if (!productPendingDelete.value) return

  deleteLoading.value = true
  requestError.value = ''

  try {
    const deletingProduct = productPendingDelete.value
    const response = await deleteProduct(deletingProduct.id)
    const shouldStepBack =
      products.value.length === 1 && pagination.value.currentPage > 1
        ? pagination.value.currentPage - 1
        : pagination.value.currentPage

    feedbackMessage.value =
      response.message || `Product "${deletingProduct.name}" deleted successfully.`
    productPendingDelete.value = null

    if (shouldStepBack !== currentPage.value) {
      await router.replace({
        name: 'products-list',
        query: shouldStepBack > 1 ? { page: String(shouldStepBack) } : {},
      })
      return
    }

    await loadProducts(shouldStepBack)
  } catch (error) {
    requestError.value = error.message || 'Unable to delete the product.'
  } finally {
    deleteLoading.value = false
  }
}

function goToCreate() {
  router.push({ name: 'products-create' })
}

function goToDetails(product) {
  router.push({
    name: 'products-details',
    params: { id: product.id },
  })
}

function goToEdit(product) {
  router.push({
    name: 'products-edit',
    params: { id: product.id },
  })
}

watch(
  () => route.query.page,
  async (value) => {
    const normalizedPage = parsePage(value)

    if (value && String(normalizedPage) !== String(value)) {
      await router.replace({
        name: 'products-list',
        query: normalizedPage > 1 ? { page: String(normalizedPage) } : {},
      })
      return
    }

    await loadProducts(normalizedPage)
  },
  { immediate: true },
)
</script>

<template>
  <MainLayout>
    <section class="flex flex-col gap-5">
      <HeaderSection
        title="Products"
        subtitle="Live product data loaded from the Laravel API envelope at /api/products."
      />

      <div
        v-if="visibleFeedbackMessage"
        class="flex flex-col gap-3 rounded-[1.35rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-700 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>{{ visibleFeedbackMessage }}</span>
        <Button type="button" variant="ghost" size="sm" @click="feedbackMessage = ''; clearRouteStatus()">
          Dismiss
        </Button>
      </div>

      <div
        v-if="requestError"
        class="flex flex-col gap-3 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-700 lg:flex-row lg:items-center lg:justify-between"
        role="alert"
      >
        <span>{{ requestError }}</span>
        <div class="flex flex-wrap gap-3">
          <Button type="button" variant="outline" size="sm" @click="loadProducts(currentPage)">
            Retry
          </Button>
          <Button type="button" variant="ghost" size="sm" @click="goToCreate">
            Create product
          </Button>
        </div>
      </div>

      <ProductTable
        :products="products"
        :loading="loading"
        :pagination="pagination"
        :deleting-id="deleteLoading ? productPendingDelete?.id : null"
        @create="goToCreate"
        @view="goToDetails"
        @edit="goToEdit"
        @delete="openDeleteDialog"
        @page-change="goToPage"
      />
    </section>

    <AlertQuestion
      :show="deleteDialogVisible"
      title="Delete product"
      :message="productPendingDelete ? `Delete ${productPendingDelete.name}? This action cannot be undone.` : ''"
      confirm-text="Delete product"
      cancel-text="Keep product"
      type="danger"
      @confirm="confirmDelete"
      @cancel="closeDeleteDialog"
    />
  </MainLayout>
</template>
