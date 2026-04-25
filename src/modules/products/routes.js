import ProductListPage from '@/modules/products/pages/ProductList.vue'
import ProductCreatePage from '@/modules/products/pages/ProductCreate.vue'
import ProductDetailsPage from '@/modules/products/pages/ProductDetails.vue'
import ProductEditPage from '@/modules/products/pages/ProductEdit.vue'

export const productRoutes = [
  {
    path: '/module/products',
    name: 'products-list',
    component: ProductListPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/module/products/create',
    name: 'products-create',
    component: ProductCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/module/products/:id/edit',
    name: 'products-edit',
    component: ProductEditPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/module/products/:id',
    name: 'products-details',
    component: ProductDetailsPage,
    meta: { requiresAuth: true },
  },
]
