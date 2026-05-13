<template>
  <v-textarea :label="label" v-model="splitStr" :rows="rows"
    :rules="rules" validate-on="input"
    @blur="onBlur"
  ></v-textarea>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { strToFloat } from '../../functions/strings'

const props = defineProps<{
  label: string
  rows: number
}>()

const model = defineModel<number[]>({ required: true })

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

function parseLines(val: string): number[] | string {
  const ret: number[] = []
  for (const line of val.split('\n')) {
    if (line.trim() === '') continue

    const nRes = strToFloat(line.trim())
    if (!nRes.ok) return nRes.error

    ret.push(nRes.value)
  }
  return ret
}

watch(model, (val) => {
  splitStr.value = val ? val.join('\n') : ''
}, { immediate: true })

</script>
