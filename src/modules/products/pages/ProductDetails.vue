<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import Loading from '@/components/feedback/Loading.vue'
import { deleteProduct, getProduct } from '@/modules/products/services/productService'
import {
  formatProductDescription,
  formatProductPrice,
  formatProductStock,
} from '@/modules/products/utils/productFormatters'

defineOptions({
  name: 'ProductDetailsPage',
})

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(false)
const deleteLoading = ref(false)
const requestError = ref('')
const deleteDialogVisible = ref(false)

const statusMessage = computed(() => {
  if (route.query.status === 'created') {
    return 'Product created successfully.'
  }

  if (route.query.status === 'updated') {
    return 'Product updated successfully.'
  }

  return ''
})

const detailCards = computed(() => {
  if (!product.value) {
    return []
  }

  return [
    {
      label: 'Price',
      value: formatProductPrice(product.value.price),
      tone: 'brand',
    },
    {
      label: 'Stock',
      value: formatProductStock(product.value.stock),
      tone: 'lime',
    },
    {
      label: 'Product ID',
      value: product.value.id ? `#${product.value.id}` : '--',
      tone: 'slate',
    },
  ]
})

async function loadProduct(productId) {
  loading.value = true
  requestError.value = ''

  try {
    const response = await getProduct(productId)
    product.value = response.data
  } catch (error) {
    product.value = null
    requestError.value = error.message || 'Unable to load the product.'
  } finally {
    loading.value = false
  }
}

function clearStatusMessage() {
  if (!route.query.status) return
  router.replace({
    name: 'products-details',
    params: { id: route.params.id },
  })
}

function goToEdit() {
  router.push({
    name: 'products-edit',
    params: { id: route.params.id },
  })
}

async function confirmDelete() {
  if (!product.value) return

  deleteLoading.value = true

  try {
    await deleteProduct(product.value.id)
    await router.push({
      name: 'products-list',
      query: { status: 'deleted' },
    })
  } catch (error) {
    requestError.value = error.message || 'Unable to delete the product.'
  } finally {
    deleteLoading.value = false
    deleteDialogVisible.value = false
  }
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
        title="Product Details"
        subtitle="Inspect a single product returned from the Laravel API and manage updates or deletion from one screen."
      />

      <div
        v-if="statusMessage"
        class="flex flex-col gap-3 rounded-[1.35rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-700 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>{{ statusMessage }}</span>
        <Button type="button" variant="ghost" size="sm" @click="clearStatusMessage">
          Dismiss
        </Button>
      </div>

      <div
        v-if="requestError"
        class="flex flex-col gap-3 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-700 lg:flex-row lg:items-center lg:justify-between"
      >
        <span>{{ requestError }}</span>
        <div class="flex flex-wrap gap-3">
          <Button type="button" variant="outline" size="sm" @click="loadProduct(route.params.id)">
            Retry
          </Button>
          <Button type="button" variant="ghost" size="sm" @click="router.push({ name: 'products-list' })">
            Back to list
          </Button>
        </div>
      </div>

      <div
        v-if="loading"
        class="rounded-[1.4rem] border border-surface-200 bg-white px-4 py-12 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]"
      >
        <Loading label="Loading product" size="md" />
      </div>

      <template v-else-if="product">
        <article
          class="overflow-hidden rounded-[1.6rem] border border-surface-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]"
        >
          <div
            class="flex flex-col gap-4 border-b border-surface-200 bg-[radial-gradient(circle_at_top_left,rgba(0,174,239,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-5 sm:px-5"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="space-y-3">
                <span
                  class="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-black tracking-[0.08em] text-brand-700 uppercase"
                >
                  Product {{ product.id ? `#${product.id}` : '' }}
                </span>
                <div class="space-y-2">
                  <h3 class="text-[clamp(1.5rem,2.4vw,2.15rem)] font-extrabold text-surface-900">
                    {{ product.name || 'Unnamed product' }}
                  </h3>
                  <p class="max-w-3xl text-sm leading-7 text-surface-600">
                    {{ formatProductDescription(product.description) }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <Button type="button" variant="outline" @click="router.push({ name: 'products-list' })">
                  Back to list
                </Button>
                <Button type="button" variant="secondary" @click="goToEdit">
                  Edit product
                </Button>
                <Button type="button" variant="danger" :loading="deleteLoading" @click="deleteDialogVisible = true">
                  Delete product
                </Button>
              </div>
            </div>
          </div>

          <div class="grid gap-4 px-4 py-5 sm:px-5 xl:grid-cols-[1.4fr_1fr]">
            <div class="grid gap-4 sm:grid-cols-3">
              <article
                v-for="card in detailCards"
                :key="card.label"
                class="rounded-[1.25rem] border border-surface-200 bg-white px-4 py-4 shadow-[0_12px_26px_-24px_rgba(15,23,42,0.28)]"
                :class="{
                  'product-card--brand': card.tone === 'brand',
                  'product-card--lime': card.tone === 'lime',
                  'product-card--slate': card.tone === 'slate',
                }"
              >
                <p class="text-xs font-black tracking-[0.08em] text-surface-500 uppercase">
                  {{ card.label }}
                </p>
                <p class="mt-2 text-xl font-extrabold text-surface-900">
                  {{ card.value }}
                </p>
              </article>
            </div>

            <article class="rounded-[1.25rem] border border-surface-200 bg-white px-4 py-4 shadow-[0_12px_26px_-24px_rgba(15,23,42,0.28)]">
              <p class="text-xs font-black tracking-[0.08em] text-surface-500 uppercase">
                API contract
              </p>
              <dl class="mt-3 grid gap-3 text-sm leading-6 text-surface-600">
                <div class="flex items-start justify-between gap-4">
                  <dt class="font-bold text-surface-900">Endpoint</dt>
                  <dd class="text-right">GET /api/products/{{ product.id }}</dd>
                </div>
                <div class="flex items-start justify-between gap-4">
                  <dt class="font-bold text-surface-900">Create fields</dt>
                  <dd class="text-right">name, price, stock</dd>
                </div>
                <div class="flex items-start justify-between gap-4">
                  <dt class="font-bold text-surface-900">Optional field</dt>
                  <dd class="text-right">description</dd>
                </div>
              </dl>
            </article>
          </div>
        </article>
      </template>
    </section>

    <AlertQuestion
      :show="deleteDialogVisible"
      title="Delete product"
      :message="product ? `Delete ${product.name}? This action cannot be undone.` : ''"
      confirm-text="Delete product"
      cancel-text="Keep product"
      type="danger"
      @confirm="confirmDelete"
      @cancel="deleteDialogVisible = false"
    />
  </MainLayout>
</template>

<style scoped>
.product-card--brand {
  background:
    radial-gradient(circle at top left, rgba(0, 174, 239, 0.12), transparent 42%),
    #ffffff;
}

.product-card--lime {
  background:
    radial-gradient(circle at top left, rgba(132, 204, 22, 0.14), transparent 42%),
    #ffffff;
}

.product-card--slate {
  background:
    radial-gradient(circle at top left, rgba(100, 116, 139, 0.12), transparent 42%),
    #ffffff;
}
</style>
