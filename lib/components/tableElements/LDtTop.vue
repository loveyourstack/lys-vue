<template>
  <v-row>
    <v-col class="d-flex align-center ga-6">
      <div class="dt-title">
        <slot name="title">{{ props.title ?? '' }}</slot>
      </div>

      <v-spacer />

      <slot /> <!-- default slot for buttons -->

      <v-menu>
        <template v-slot:activator="{ props: menuProps }">
          <v-btn icon="mdi-dots-vertical" flat v-bind="menuProps"></v-btn>
        </template>
        <v-list>

          <v-list-item prepend-icon="mdi-selection-ellipse-remove" @click="emit('resetTable')">
            <v-list-item-title class="clickable">Reset table</v-list-item-title>
          </v-list-item>

          <l-adjust-cols-list :headers="props.headers" v-model="excludedHeadersModel" />

          <v-list-item prepend-icon="mdi-download-outline" @click="async () => await fileDownload(props.ax, props.excelDlUrl, props.reqHeaders)">
            <v-list-item-title class="clickable">Download to Excel</v-list-item-title>
          </v-list-item>

          <slot name="menuItems" />

        </v-list>
      </v-menu>

    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { type AxiosInstance } from 'axios'
import { fileDownload } from '../../functions/file'

const props = defineProps<{
  ax: AxiosInstance
  headers: readonly any[]
  excelDlUrl: string
  title?: string
  reqHeaders?: Record<string, string>
}>()

const excludedHeadersModel = defineModel<string[]>('excludedHeaders', { required: true })

const emit = defineEmits<{
  (e: 'resetTable'): void
}>()
</script>
