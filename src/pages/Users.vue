<script setup>
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'

defineOptions({
  name: 'UsersPage',
})

const { t } = useI18n()

const mockUsers = [
  { id: 1, name: 'Dara Sok', email: 'dara.sok@hfccf.org', role: 'Admin' },
  { id: 2, name: 'Sreyneang Ly', email: 'sreyneang.ly@hfccf.org', role: 'Manager' },
  { id: 3, name: 'Vannak Chhouk', email: 'vannak.chhouk@hfccf.org', role: 'Staff' },
]
</script>

<template>
  <MainLayout>
    <section class="users-page">
      <HeaderSection :title="t('nav.users')" :subtitle="t('pages.usersDescription')" />

      <div class="users-page__card">
        <table class="users-page__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in mockUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.users-page__card {
  border: 1px solid #e2e8f0;
  border-radius: 0.85rem;
  background: #ffffff;
  padding: 0.9rem;
  overflow-x: auto;
}

.users-page__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}

.users-page__table th,
.users-page__table td {
  padding: 0.65rem 0.7rem;
  border-bottom: 1px solid #f1f5f9;
  text-align: left;
  font-size: 0.9rem;
}

.users-page__table th {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #475569;
}

.users-page__table tbody tr:hover {
  background: #f8fafc;
}
</style>
