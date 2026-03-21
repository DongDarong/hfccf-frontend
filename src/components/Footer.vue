<template>
  <footer class="footer">
    <div class="container mx-auto px-4 py-6 text-center text-gray-500">
      <p>&copy; {{ new Date().getFullYear() }} HFCCF. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
defineOptions({
  name: 'MainFooter',
})
</script>

<style scoped>
.footer {
  border-top: 1px solid #e5e7eb;
}
</style>
