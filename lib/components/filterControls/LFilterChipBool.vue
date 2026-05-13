<template>
  <l-filter-chip :name="name" :filterText="filterText" :applied="model !== undefined" v-model:menu="outerMenuOpen" @close="emit('close')">

    <v-select :label="name" v-model="model" v-model:menu="autoMenuOpen" autofocus
      :items="BooleanOptions"
      @update:menu="handleAutocompleteMenuUpdate"
    ></v-select>

  </l-filter-chip>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { setAutocompleteMenus } from '../../functions/forms'
import { BooleanOptions } from '../../types/base'

const props = defineProps<{
  name: string
}>()

// don't set required: true for boolean | undefined, it causes TS error.
// see https://github.com/vuejs/vue/issues/4792#issuecomment-1591765678
const model = defineModel<boolean | undefined>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const filterText = computed(() => {
  return model.value != undefined ? BooleanOptions.find(ele => ele.value === model.value)?.title : ''
})

// ensure menu closes when autocomplete closes
const outerMenuOpen = ref(false)
const autoMenuOpen = ref(false)
function handleAutocompleteMenuUpdate(isOpen: boolean) { setAutocompleteMenus(autoMenuOpen, outerMenuOpen, isOpen) }

</script>