<template>
  <v-menu v-model="showDateDp" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-text-field v-bind="props" :class="tFClass" :label="label ?? 'Date'" prepend-inner-icon="mdi-calendar" readonly :clearable="clearable" :hide-details="hideDetails"
        :model-value="displayDate" :rules="rules"
        @click:clear="emit('cleared')"
      ></v-text-field>
    </template>
    <template #default>
      <v-date-picker color="primary" v-model="model" :max="max" @update:model-value="showDateDp = false; emit('updated', model)"></v-date-picker>
    </template>
  </v-menu>
</template>

<script lang="ts" setup>

// not currently used: using v-text-field with type="date" instead in forms for now

import { ref, computed } from 'vue'
import { useDateFormat } from '@vueuse/core'

const props = defineProps<{
  label?: string
  tFClass?: string // tF = text field
  clearable?: boolean
  hideDetails?: boolean
  max?: Date | string
  rules?: readonly ((v: any) => boolean | string)[]
}>()

const model = defineModel<Date | undefined>({ required: true })

const emit = defineEmits<{
  (e: 'cleared'): void
  (e: 'updated', val: Date | undefined): void
}>()

const displayDate = computed(() =>
  model ? useDateFormat(model, 'DD MMM YYYY').value : undefined
)

const showDateDp = ref(false)

</script>