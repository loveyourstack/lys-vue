<template>
  <l-filter-chip :name="name" :filterText="filterText" :applied="modelTruthy" v-model:menu="outerMenuOpen" @close="emit('close')">

    <v-autocomplete :label="name" v-model="model" v-model:menu="autoMenuOpen" autofocus :multiple="multiple"
      :items="items"
      @update:menu="handleAutocompleteMenuUpdate"
    ></v-autocomplete>

  </l-filter-chip>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { setAutocompleteMenus } from '../../functions/forms'

const props = defineProps<{
  name: string
  items: string[]
  multiple?: boolean
}>()

const model = defineModel<string | string[] | undefined>({ required: true })

const emit = defineEmits<{
  (e: 'close'): void
}>()

const filterText = computed(() => {
  if (props.multiple) {
    // display selection in the same order as found in props.items
    return model.value ? (props.items.filter(ele => (model.value as string[]).includes(ele)).join(', ')) : '' 
  }
  return model.value ?? ''
})

const modelTruthy = computed(() => {
  if (model.value === undefined) return false
  if (props.multiple) {
    return (model.value as string[]).length > 0
  }
  return true
})

// in multiple mode, if the last value is deselected, treat as undefined and closed
watch(model, (newVal, oldVal) => {
  if (!props.multiple) return
  if (typeof newVal === 'string' || typeof oldVal === 'string') return

  if (oldVal && oldVal?.length > 0 && newVal?.length === 0) {
    model.value = undefined
    emit('close')
  }
})

const outerMenuOpen = ref(false)
const autoMenuOpen = ref(false)
function handleAutocompleteMenuUpdate(isOpen: boolean) { setAutocompleteMenus(autoMenuOpen, outerMenuOpen, isOpen) }

</script>