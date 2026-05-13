<template>
  <l-filter-chip :name="name" :filterText="filterText" :applied="modelTruthy" v-model:menu="outerMenuOpen" @close="emit('close')">

    <v-autocomplete :label="name" v-model="model" v-model:menu="autoMenuOpen" autofocus :multiple="multiple"
      :items="items" item-title="name" item-value="id"
      @update:menu="handleAutocompleteMenuUpdate"
    ></v-autocomplete>

  </l-filter-chip>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { setAutocompleteMenus } from '../../functions/forms'
import type { SelectionItem } from '../../types/base'

const props = defineProps<{
  name: string
  items: SelectionItem[]
  multiple?: boolean
}>()

const model = defineModel<number | number[] | undefined>({ required: true })

const emit = defineEmits<{
  (e: 'close'): void
}>()

const filterText = computed(() => {
  if (props.multiple) {
    // display selection in the same order as found in props.items
    return model.value ? (props.items.filter(ele => (model.value as number[]).includes(ele.id)).map(ele => ele.name).join(', ')) : '' 
  }
  return model.value ? props.items.find(ele => ele.id === model.value)?.name : ''
})

const modelTruthy = computed(() => {
  if (model.value === undefined) return false
  if (props.multiple) {
    return (model.value as number[]).length > 0
  }
  return true
})

// in multiple mode, if the last value is deselected, treat as undefined and closed
watch(model, (newVal, oldVal) => {
  if (!props.multiple) return
  if (typeof newVal === 'number' || typeof oldVal === 'number') return

  if (oldVal && oldVal?.length > 0 && newVal?.length === 0) {
    model.value = undefined
    emit('close')
  }
})

const outerMenuOpen = ref(false)
const autoMenuOpen = ref(false)
function handleAutocompleteMenuUpdate(isOpen: boolean) { setAutocompleteMenus(autoMenuOpen, outerMenuOpen, isOpen) }

</script>