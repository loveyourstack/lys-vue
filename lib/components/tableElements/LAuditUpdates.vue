<template>
  <v-card-title class="pl-1 mb-1">
    {{ title ? title : 'ID ' + props.id }}
  </v-card-title>

  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    v-model:page="page"
    v-model:sortBy="sortBy"
    :headers="headers"
    hover
    :items-length="totalItems"
    :items="items"
    multi-sort
    :search="search"
    show-current-page
    item-value="id"
    no-data-text="No history"
    @update:options="loadItems"
  >

    <template v-slot:[`item.affected_at`]="{ item }">
      <span>{{ useDateFormat(item.affected_at, 'DD MMM YYYY HH:mm:ss') }}</span>
    </template>

    <template v-slot:[`item.changes`]="{ item }">
      <v-table v-if="item.changes" density="compact" class="mb-0">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 40%" />
          <col style="width: 40%" />
        </colgroup>
        <tbody>
          <tr v-for="(change, index) in item.changes" :key="index">
            <td class="font-weight-medium pl-0">{{ change.column }}</td>
            <td>{{ change.old_value }}</td>
            <td>{{ change.new_value }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>

    <template #bottom>
      <l-dt-bottom :itemsPerPage="itemsPerPage" :page="page" :totalItemsIsEstimate="totalItemsIsEstimate" :totalItemsEstimated="totalItemsEstimated"></l-dt-bottom>
    </template>

  </v-data-table-server>

  <v-row density="compact">
    <v-col class="d-flex align-center">

      <v-btn icon @click="emit('close')">
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-btn>

    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import type { AxiosInstance } from 'axios'
import { useTableState } from '../../composables/use_table'
import { LDtBottom } from '.'
import { type AuditUpdate, type FkReplacement } from '../../types/audit'

const props = defineProps<{
  ax: AxiosInstance
  baseUrl: string
  title?: string
  schemaName: string
  tableName: string
  id: number
  fkReplacements?: FkReplacement[] // allow passing in structures to replace FK column names, and id values with strings
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const headers = [
  { title: 'Updated at', key: 'affected_at' },
  { title: 'Updated by', key: 'affected_by' },
  { title: 'Column | From | To', key: 'changes', sortable: false },
] as const

const { items, itemsPerPage, page, sortBy, search, totalItems, totalItemsIsEstimate, totalItemsEstimated,
  loadItems,
} = useTableState<AuditUpdate>({ ax: props.ax, baseUrl: props.baseUrl, mapUrl, onFetchSuccess })

function addChanges(item: AuditUpdate) {
  item.changes = []

  // add each old value with its new value
  for (const key of Object.keys(item.affected_old_values)) {
    item.changes.push({
      column: key,
      old_value: item.affected_old_values[key],
      new_value: key in item.affected_new_values ? item.affected_new_values[key] : 'Unknown',
    })
  }

  // add any new values that don't have old values
  for (const key of Object.keys(item.affected_new_values)) {
    if (!(key in item.affected_old_values)) {
      item.changes.push({
        column: key,
        old_value: 'Unknown',
        new_value: item.affected_new_values[key],
      })
    }
  }
}

function mapUrl(url: string): string {
  const params = new URLSearchParams({
    affected_schema: props.schemaName,
    affected_table: props.tableName,
    affected_id: String(props.id),
  })
  return url + '&' + params.toString()
}

function onFetchSuccess() {
  items.value.forEach(item => {
    addChanges(item)
    processFkReplacements(item)
  })
}

function processFkReplacements(item: AuditUpdate) {
  if (!props.fkReplacements) return

  // build map of fk_column -> replacement
  const replacementMap = new Map(
    props.fkReplacements.map(r => [r.fk_column, r])
  )

  // build map of id->name maps per replacement
  const idNameMaps = new Map<string, Map<string | number, string>>()
  props.fkReplacements.forEach(replacement => {
    const idMap = new Map(
      replacement.selectionItems.map(item => [item.id, item.name])
    )
    idNameMaps.set(replacement.fk_column, idMap)
  })

  item.changes.forEach(change => {
    const replacement = replacementMap.get(change.column)
    if (!replacement) return

    // replace column name (e.g. parent_fk -> parent)
    change.column = replacement.new_column_name

    // replace old and new FK id values with names
    const idMap = idNameMaps.get(replacement.fk_column)
    if (idMap) {
      change.old_value = idMap.get(change.old_value) || change.old_value
      change.new_value = idMap.get(change.new_value) || change.new_value
    }
  })
}

</script>