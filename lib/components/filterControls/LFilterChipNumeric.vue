<template>
  <l-filter-chip :name="name" :filterText="filterText" :applied="model?.operator !== undefined" @close="emit('close')">
    
    <v-select label="Operator" v-model="operatorProxy" autofocus :items="FilterOperators"
    ></v-select>

    <v-text-field type="number" label="Value" v-model.number="valueProxy"
    ></v-text-field>

    <v-text-field v-if="operatorProxy === '<=>'" type="number" label="Value" v-model.number="valueUpperProxy"
    ></v-text-field>

  </l-filter-chip>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { type FilterOperator, FilterOperators, type NumericFilter } from '../../types/base'

const props = defineProps<{
  name: string
  isPercent?: boolean
}>()

const model = defineModel<NumericFilter | undefined>({ required: true })

const emit = defineEmits<{
  (e: 'change'): void
  (e: 'changeDebounced'): void
  (e: 'close'): void
}>()

const defaultNumericFilter: NumericFilter = { operator: undefined, value: 0, value_upper: 0 }

const filterText = computed(() => {
  return getNumericFilterDisplayText(model.value, props.isPercent)
})

// use FilterOperator property proxies to handle the case where model.value is undefined 
// and to trigger model change in parent components when any FilterOperator property is changed
const operatorProxy = computed<FilterOperator | undefined>({
  get: () => model.value?.operator ?? defaultNumericFilter.operator,
  set: (next) => patchModel({ operator: next }, 'immediate'),
})
const valueProxy = computed<number>({
  get: () => model.value?.value ?? defaultNumericFilter.value,
  set: (next) => patchModel({ value: next }, 'debounced'),
})
const valueUpperProxy = computed<number>({
  get: () => model.value?.value_upper ?? defaultNumericFilter.value_upper,
  set: (next) => patchModel({ value_upper: next }, 'debounced'),
})

function getNumericFilterDisplayText(nf: NumericFilter | undefined, isPercent?: boolean): string {
 
  if (!nf || !nf.operator) { 
    return ''
  }

  const val: number = nf.value ? nf.value : 0 // ensure that 0 rather than '' is shown when user deletes value in textbox
  const val_upper: number = nf.value_upper ? nf.value_upper : 0

  let val_s: string = val.toString()
  if (isPercent) {
    val_s += '%'
  }
  let val_upper_s: string = val_upper.toString()
  if (isPercent) {
    val_upper_s += '%'
  }

  if (nf.operator === '<=>') {
    if (val_upper < val) {
      return 'invalid'
    }

    return nf.operator + ' ' + val_s + ' and ' + val_upper_s
  }

  return nf.operator + ' ' + val_s
}

function patchModel(
  patch: Partial<NumericFilter>,
  mode: 'immediate' | 'debounced',
) {
  model.value = { ...(model.value ?? defaultNumericFilter), ...patch }

  if (mode === 'immediate') {
    emit('change')
  } else {
    emit('changeDebounced')
  }
}

</script>