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
    item-value="table_name"
    @update:options="loadItems"
  >
    <template #top>
      <l-dt-top :ax="ax" :title="props.title ?? 'Table size'" :headers="headers" :excelDlUrl="excelDlUrl" v-model:excludedHeaders="excludedHeaders" @resetTable="resetTable()">
        <v-btn icon flat v-tooltip="'Refresh'" @click="refreshItems()">
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </l-dt-top>
    </template>

    <template v-slot:[`item.row_estimate`]="{ item }">
      {{ formatter.format(item.row_estimate!) }}
    </template>

    <template v-slot:[`item.table_bytes`]="{ item }">
      {{ formatter.format(item.table_bytes!) }}
    </template>

    <template v-slot:[`item.index_bytes`]="{ item }">
      {{ formatter.format(item.index_bytes!) }}
    </template>

    <template v-slot:[`item.toast_bytes`]="{ item }">
      {{ formatter.format(item.toast_bytes!) }}
    </template>

    <template v-slot:[`item.total_bytes`]="{ item }">
      {{ formatter.format(item.total_bytes!) }}
    </template>

    <template v-slot:[`item.total_size_share`]="{ item }">
      {{ formatterDec1.format(item.total_size_share! * 100) + ' %' }}
    </template>

    <template #bottom>
      <l-dt-bottom :itemsPerPage="itemsPerPage" :page="page" :totalItemsIsEstimate="totalItemsIsEstimate" :totalItemsEstimated="totalItemsEstimated"></l-dt-bottom>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { type AxiosInstance } from 'axios'
import { useJsonLs } from '../../composables/use_local_storage'
import { useTableExcelDlUrl, useTableHeaders, useTableState } from '../../composables/use_table'
import { LDtBottom, LDtTop } from '../tableElements'
import { type PgMonTableSize } from '../../types/pgMon'

const props = defineProps<{
  ax: AxiosInstance
  baseUrl: string
  title?: string
}>()

const headers = [
  { title: 'Schema', key: 'table_schema' },
  { title: 'Table', key: 'table_name' },
  { title: 'Est. # rows', key: 'row_estimate', align: 'end' },
  { title: 'Total', key: 'total_bytes', align: 'end' },
  { title: '%', key: 'total_size_share', align: 'end' },
  { title: 'Table', key: 'table_bytes', align: 'end' },
  { title: 'Indexes', key: 'index_bytes', align: 'end' },
  { title: 'Toast', key: 'toast_bytes', align: 'end' },
] as const
const { excludedHeaders, selectedHeaders } = useTableHeaders(headers)

const { excelDlUrl } = useTableExcelDlUrl(props.baseUrl)

const { items, itemsPerPage, page, sortBy, search, totalItems, totalItemsIsEstimate, totalItemsEstimated,
  loadItems, refreshItems
} = useTableState<PgMonTableSize>({ ax: props.ax, baseUrl: props.baseUrl })

const formatter = new Intl.NumberFormat()
const formatterDec1 = new Intl.NumberFormat(undefined , { maximumFractionDigits: 1, minimumFractionDigits: 1})

const { resetTable } = useJsonLs({
  lsKey: 'pg_mon_table_size_dt',
  refs: {
    excludedHeaders,
    itemsPerPage,
    sortBy,
  },
})
</script>
