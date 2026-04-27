<script setup>
defineOptions({
  name: 'AddClassFormFields',
})

defineProps({
  levelOptions: {
    type: Array,
    default: () => [],
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  code: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  teacher: {
    type: String,
    default: '',
  },
  level: {
    type: String,
    default: '',
  },
  schedule: {
    type: String,
    default: '',
  },
  students: {
    type: [String, Number],
    default: 0,
  },
  status: {
    type: String,
    default: '',
  },
  room: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'update:code',
  'update:name',
  'update:teacher',
  'update:level',
  'update:schedule',
  'update:students',
  'update:status',
  'update:room',
  'update:notes',
])
</script>

<template>
  <div class="add-class-form-fields">
    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Class Code</span>
      <input
        :value="code"
        type="text"
        placeholder="PS-NUR-03"
        :disabled="isLocked"
        @input="$emit('update:code', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Class Name</span>
      <input
        :value="name"
        type="text"
        placeholder="Morning Nursery Blue"
        :disabled="isLocked"
        @input="$emit('update:name', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Teacher</span>
      <input
        :value="teacher"
        type="text"
        placeholder="Teacher name"
        :disabled="isLocked"
        @input="$emit('update:teacher', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Level</span>
      <select :value="level" :disabled="isLocked" @change="$emit('update:level', $event.target.value)">
        <option v-for="option in levelOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Schedule</span>
      <input
        :value="schedule"
        type="text"
        placeholder="Mon-Fri, 8:00 AM"
        :disabled="isLocked"
        @input="$emit('update:schedule', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Students</span>
      <input
        :value="students"
        type="number"
        min="0"
        placeholder="0"
        :disabled="isLocked"
        @input="$emit('update:students', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Status</span>
      <select :value="status" :disabled="isLocked" @change="$emit('update:status', $event.target.value)">
        <option v-for="option in statusOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">Room</span>
      <input
        :value="room"
        type="text"
        placeholder="Room A1"
        :disabled="isLocked"
        @input="$emit('update:room', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--full">
      <span class="add-class-form-fields__label">Notes</span>
      <textarea
        :value="notes"
        rows="4"
        placeholder="Optional notes about the class, materials, or scheduling."
        :disabled="isLocked"
        @input="$emit('update:notes', $event.target.value)"
      />
    </label>
  </div>
</template>

<style scoped>
.add-class-form-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.95rem;
}

.add-class-form-fields__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.add-class-form-fields__field--half {
  grid-column: span 1;
}

.add-class-form-fields__field--full {
  grid-column: 1 / -1;
}

.add-class-form-fields__label {
  color: #334155;
  font-size: 0.84rem;
  font-weight: 700;
}

@media (max-width: 720px) {
  .add-class-form-fields {
    grid-template-columns: 1fr;
  }
}
</style>
