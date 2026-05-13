<template>
  <v-textarea :label="label" v-model="splitStr" :rows="rows"
    :rules="rules" validate-on="input"
    @blur="onBlur"
    hint="Enter in YYYY-MM-DD format"
  ></v-textarea>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { strToDate } from '../../functions/string'

const props = defineProps<{
  label: string
  rows: number
}>()

const model = defineModel<string[]>({ required: true })

const rules = [
  (val: string) => {
    const parsed = parseLines(val)
    if (typeof parsed === 'string') return parsed
    return true
  },
]

const splitStr = ref('')

function onBlur() {
  const parsed = parseLines(splitStr.value)
  if (typeof parsed === 'string') return
  model.value = parsed
}

function parseLines(val: string): string[] | string {
  const ret: string[] = []
  for (const line of val.split('\n')) {
    if (line.trim() === '') continue

    const dRes = strToDate(line.trim())
    if (!dRes.ok) return dRes.error
    if (dRes.value < new Date('1900-01-01')) return 'Date must be >= 1 Jan 1900'

    ret.push(line.trim())
  }
  return ret
}

watch(model, (val) => {
  splitStr.value = val ? val.join('\n') : ''
}, { immediate: true })

</script>
