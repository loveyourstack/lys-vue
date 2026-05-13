<template>
  <v-menu v-model="showTimeP" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-text-field v-bind="props" :class="tFClass" :label="label ?? 'Time'" prepend-inner-icon="mdi-clock-outline" readonly :clearable="clearable" :hide-details="hideDetails"
        :model-value="model ? model : undefined" :rules="rules"
        @click:clear="emit('cleared')"
      ></v-text-field>
    </template>
    <template #default>
      <v-time-picker format="24hr" v-model="model" :allowed-minutes="(m: number) => m % 5 === 0"
      ></v-time-picker>
    </template>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  label?: string
  tFClass?: string // tF = text field
  clearable?: boolean
  hideDetails?: boolean
  rules?: readonly ((v: any) => boolean | string)[]
}>()

const model = defineModel<string | undefined>({ required: true }) // hh24:mm

const emit = defineEmits<{
  (e: 'cleared'): void
  (e: 'updated', val: string | undefined): void // hh24:mm
}>()

const showTimeP = ref(false)

</script>