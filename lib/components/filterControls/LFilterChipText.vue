<template>
  <l-filter-chip :name="name" :filterText="model" :applied="model !== undefined" @close="emit('close')">

    <v-text-field :label="name" v-model="model" autofocus
    ></v-text-field>

  </l-filter-chip>
</template>

<script lang="ts" setup>
import { watch } from 'vue'

// note: see functions/datatables.ts getTextFilterUrlParam() to see how filterValue is used for API query params

const props = defineProps<{
  name: string
}>()

const model = defineModel<string | undefined>({ required: true })

const emit = defineEmits<{
  (e: 'close'): void
}>()

// if value is deleted by user in text field, treat as undefined and closed
watch(model, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    model.value = undefined
    emit('close')
  }
})

</script>