<script setup>
defineOptions({
  name: 'AddClassIntro',
})
</script>

<template>
  <section class="add-class-intro">
    <p class="add-class-intro__eyebrow">Preschool Class</p>
    <h3 class="add-class-intro__title">Class setup</h3>
    <p class="add-class-intro__text">
      Register a class, assign the teacher, and prepare the schedule before enrollment opens.
    </p>
  </section>
</template>

<style scoped>
.add-class-intro {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  border: 1px solid #dbeafe;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(224, 242, 254, 0.7) 0%, rgba(255, 255, 255, 0.96) 100%);
}

.add-class-intro__eyebrow {
  margin: 0;
  color: #0f6f8f;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.add-class-intro__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 800;
}

.add-class-intro__text {
  margin: 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.6;
}
</style>
