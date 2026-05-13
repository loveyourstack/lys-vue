<template>
  <v-textarea :label="label" v-model="splitStr" :rows="rows"
    @blur="onBlur"
  ></v-textarea>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  label: string
  rows: number
}>()

const model = defineModel<string[]>({ required: true })

const splitStr = ref('')

function onBlur() {
  const parsed = splitStr.value.split('\n').map(v => v.trim()).filter(s => s.length > 0)
  model.value = parsed
}

watch(model, (val) => {
  splitStr.value = val ? val.join('\n') : ''
}, { immediate: true })

</script>
