<template>
  <l-filter-chip :name="name" :filterText="filterText" :applied="model?.operator !== undefined" @close="emit('close')">
    
    <v-select label="Operator" v-model="operatorProxy" autofocus :items="FilterOperators"
    ></v-select>

    <v-text-field type="date" label="Value" v-model="valueProxy"
    ></v-text-field>

    <v-text-field v-if="operatorProxy === '<=>'" type="date" label="Value" v-model="valueUpperProxy"
    ></v-text-field>

  </l-filter-chip>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { type DateFilter, type FilterOperator, FilterOperators } from '../../types/base'

const props = defineProps<{
  name: string
}>()

const model = defineModel<DateFilter | undefined>({ required: true })

const emit = defineEmits<{
  (e: 'change'): void
  (e: 'changeDebounced'): void
  (e: 'close'): void
}>()

const defaultDateFilter: DateFilter = { operator: undefined, value: new Date().toISOString().split('T')[0]!, value_upper: '' }

const filterText = computed(() => {
  return getDateFilterDisplayText(model.value)
})

// use FilterOperator property proxies to handle the case where model.value is undefined 
// and to trigger model change in parent components when any FilterOperator property is changed
const operatorProxy = computed<FilterOperator | undefined>({
  get: () => model.value?.operator ?? defaultDateFilter.operator,
  set: (next) => patchModel({ operator: next }, 'immediate'),
})
const valueProxy = computed<string>({
  get: () => model.value?.value ?? defaultDateFilter.value,
  set: (next) => patchModel({ value: next }, 'debounced'),
})
const valueUpperProxy = computed<string>({
  get: () => model.value?.value_upper ?? defaultDateFilter.value_upper,
  set: (next) => patchModel({ value_upper: next }, 'debounced'),
})

function getDateFilterDisplayText(df: DateFilter | undefined): string {
 
  if (!df || !df.operator || !df.value) { 
    return ''
  }

  const valD: Date = new Date(df.value)
  if (isNaN(valD.getTime())) {
    return ''
  }

  if (df.operator === '<=>') {

    const valUpperD: Date = new Date(df.value_upper)
    if (isNaN(valUpperD.getTime())) {
      return 'invalid'
    }

    if (valUpperD < valD) {
      return 'invalid'
    }

    return df.operator + ' ' + useDateFormat(valD, 'DD MMM YYYY').value + ' and ' + useDateFormat(valUpperD, 'DD MMM YYYY').value
  }

  return df.operator + ' ' + useDateFormat(valD, 'DD MMM YYYY').value
}

function patchModel(
  patch: Partial<DateFilter>,
  mode: 'immediate' | 'debounced',
) {
  model.value = { ...(model.value ?? defaultDateFilter), ...patch }

  if (mode === 'immediate') {
    emit('change')
  } else {
    emit('changeDebounced')
  }
}

</script>
