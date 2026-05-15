<template>
  <footer class="border-t border-surface-200">
    <div class="container mx-auto px-4 py-6 text-center text-surface-500">
      <p>&copy; {{ new Date().getFullYear() }} HFCCF. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
defineOptions({
  name: 'MainFooter',
})
</script>
