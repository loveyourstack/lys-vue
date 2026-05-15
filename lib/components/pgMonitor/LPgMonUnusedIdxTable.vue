<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    v-model:page="page"
    v-model:sortBy="sortBy"
    :headers="selectedHeaders"
    hover
    :items-length="totalItems"
    :items="items"
    multi-sort
    :search="search"
    show-current-page
    item-value="index_name"
    @update:options="loadItems"
  >
    <template #top>
      <l-dt-top :ax="ax" :title="props.title ?? 'Unused indexes'" :headers="headers" :excelDlUrl="excelDlUrl" v-model:excludedHeaders="excludedHeaders" @resetTable="resetTable()">
        <v-btn icon flat v-tooltip="'Refresh'" @click="refreshItems()">
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </l-dt-top>
    </template>

    <template v-slot:[`item.index_size`]="{ item }">
      {{ formatter.format(item.index_size!) }}
    </template>

    <template v-slot:[`item.index_scans`]="{ item }">
      {{ formatter.format(item.index_scans!) }}
    </template>

    <template v-slot:[`item.last_idx_scan`]="{ item }">
      <span>{{ useDateFormat(item.last_idx_scan, 'DD MMM YYYY HH:mm:ss') }}</span>
    </template>

    <template #bottom>
      <l-dt-bottom :itemsPerPage="itemsPerPage" :page="page" :totalItemsIsEstimate="totalItemsIsEstimate" :totalItemsEstimated="totalItemsEstimated"></l-dt-bottom>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { type AxiosInstance } from 'axios'
import { useJsonLs } from '../../composables/use_local_storage'
import { useTableExcelDlUrl, useTableHeaders, useTableState } from '../../composables/use_table'
import { LDtBottom, LDtTop } from '../tableElements'
import { type PgMonUnusedIdx } from '../../types/pgMon'

const props = defineProps<{
  ax: AxiosInstance
  baseUrl: string
  title?: string
}>()

const headers = [
  { title: 'Schema', key: 'table_schema' },
  { title: 'Table', key: 'table_name' },
  { title: 'Index', key: 'index_name' },
  { title: 'Size', key: 'index_size', align: 'end' },
  { title: '# scans', key: 'index_scans', align: 'end' },
  { title: 'Last scan', key: 'last_idx_scan' },
] as const
const { excludedHeaders, selectedHeaders } = useTableHeaders(headers)

const { excelDlUrl } = useTableExcelDlUrl(props.baseUrl)

const { items, itemsPerPage, page, sortBy, search, totalItems, totalItemsIsEstimate, totalItemsEstimated,
  loadItems, refreshItems
} = useTableState<PgMonUnusedIdx>({ ax: props.ax, baseUrl: props.baseUrl })

const formatter = new Intl.NumberFormat()

const { resetTable } = useJsonLs({
  lsKey: 'pg_mon_unused_idx_dt',
  refs: {
    excludedHeaders,
    itemsPerPage,
    sortBy,
  },
})
</script>
