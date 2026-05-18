<template>
  <v-card-title class="pl-1 mb-1">
    {{ props.title }}
  </v-card-title>

  <v-card-subtitle v-if="props.subtitle" class="pl-1 mb-2">
    {{ props.subtitle }}
  </v-card-subtitle>

  <v-card-subtitle class="pl-1">
    Please enter each item on a new line. Trailing commas will be removed.
  </v-card-subtitle>

  <v-card-subtitle v-if="props.sampleSheetLink" class="pl-1 mt-2">
    <a :href="props.sampleSheetLink" target="_blank" rel="noopener noreferrer">View sample Google sheet</a>
  </v-card-subtitle>

  <v-form ref="form" class="mt-2">

    <v-row>
      <v-col class="form-col">
        <v-textarea rows="8" v-model="val" :rules="inputRules" autofocus
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row v-if="cleanedStats.validLines <= props.maxItems && cleanedStats.duplicatedLines === 0" 
      density="compact" class="mt-0 pb-1">
      <v-col>
        <ul class="mt-0 mb-0 ml-4 pa-0">
          <li v-if="cleanedStats.validLines > 0" class="text-secondary text-body-medium">
            {{ cleanedStats.validLinesText }}.
          </li>
          <li v-if="cleanedStats.noContentLines > 0" class="text-warning text-body-medium">
            {{ cleanedStats.noContentLinesText }}.
          </li>
        </ul>
      </v-col>
    </v-row>
    
    <v-row density="compact">
      <v-col class="d-flex align-center ga-6">

        <v-btn icon @click="$emit('cancel')">
          <v-icon icon="mdi-arrow-left"></v-icon>
        </v-btn>

        <v-btn color="primary" @click="enter">Enter</v-btn>

      </v-col>
    </v-row>

  </v-form>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { type VForm } from 'vuetify/components'

const props = defineProps<{
  title: string
  maxItems: number
  subtitle?: string
  sampleSheetLink?: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'enter', valA: string[]): void
}>()

const cleanedStats = computed(() => {
  if (!val.value) {
    return {
      validLines: 0,
      validLinesText: '',
      noContentLines: 0,
      noContentLinesText: '',
      duplicatedLines: 0,
    }
  }

  const seen = new Map<string, number>()
  let validLines = 0
  let validLinesText = ''
  let noContentLines = 0
  let noContentLinesText = ''
  let duplicatedLines = 0

  for (const rawLine of val.value.split(/\r?\n/)) {
    // skip lines with only newline character
    if (!rawLine) {
      continue
    }

    const cleaned = cleanValue(rawLine)

    // count no content lines after cleaning (e.g. lines with only spaces or commas)
    if (!cleaned) {
      noContentLines++
      continue
    }

    validLines++

    const next = (seen.get(cleaned) ?? 0) + 1
    seen.set(cleaned, next)
    if (next > 1) {
      duplicatedLines++
    }
  }

  validLinesText = `${validLines} valid lines`
  if (validLines === 1) {
    validLinesText = '1 valid line'
  }

  noContentLinesText = `${noContentLines} lines with no valid content`
  if (noContentLines === 1) {
    noContentLinesText = '1 line with no valid content'
  }

  return {
    validLines,
    validLinesText,
    noContentLines,
    noContentLinesText,
    duplicatedLines,
  }
})

const cleanValue = (v: string): string => {
  // remove trailing space and comma
  // don't trim: it removes trailing /t chars which are needed when pasting values from Excel
  let cleaned = v.replace(/ +$/, '').replace(/,+$/, '')
  return cleaned
}

const form = ref<InstanceType<typeof VForm>>()

const inputRules = [
  () => !!val.value || 'Values are required',
  () => {
    if (cleanedStats.value.duplicatedLines > 0) {
      return `${cleanedStats.value.duplicatedLines} item(s) are duplicated`
    }
    return true
  },
  () => {
    if (cleanedStats.value.validLines > props.maxItems) {
      return `Maximum ${props.maxItems} items allowed`
    }
    return true
  },
]

const val = ref('')

async function enter() {
  const result = await form.value?.validate()
  if (!result?.valid) {
    return
  }

  const valA = val.value.split(/\r?\n/)
  let cleanedA: string[] = ([])

  valA.forEach((v) => {

    let cleaned = cleanValue(v)
    if (!cleaned) { 
      return
    }

    cleanedA.push(cleaned)
  })

  if (cleanedA.length === 0) {
    return
  }

  emit('enter', cleanedA)
}

</script>
