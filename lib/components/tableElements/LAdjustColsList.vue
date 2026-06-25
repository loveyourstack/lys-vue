<template>
  <v-menu :close-on-content-click=false location="start">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" prepend-icon="mdi-table-column">
        <v-list-item-title class="clickable">{{ adjustColumnsLabel || 'Adjust columns' }}</v-list-item-title>
      </v-list-item>
    </template>
    <v-list>
      <v-list-item v-for="(header, i) in props.headers" :key="i" :value="header" 
        @click="excludedHeaders.includes(header.key) ? excludedHeaders = excludedHeaders.filter((v) => v != header.key) : excludedHeaders.push(header.key); emit('change')">
        <template v-slot:append>
          <v-icon :icon="getHeaderListIcon(excludedHeaders, header.key)" :color="getHeaderListIconColor(excludedHeaders, header.key)"></v-icon>
        </template>
        <v-list-item-title class="clickable" v-text="header.title"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>

const props = defineProps<{
  headers: readonly any[]
  adjustColumnsLabel?: string
}>()

const excludedHeaders = defineModel<string[]>({ required: true })

const emit = defineEmits<{
  (e: 'change'): void
}>()

function getHeaderListIcon(excludedHeaders: string[], headerKey: string) {
  return excludedHeaders.includes(headerKey) ? 'mdi-close' : 'mdi-check'
}
function getHeaderListIconColor(excludedHeaders: string[], headerKey: string) {
  return excludedHeaders.includes(headerKey) ? 'error' : 'success'
}

</script>