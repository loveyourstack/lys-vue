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
      <l-dt-top :ax="ax" :title="props.title ?? 'Bloat'" :headers="headers" :excelDlUrl="excelDlUrl" v-model:excludedHeaders="excludedHeaders" @resetTable="resetTable()">
        <v-btn icon flat v-tooltip="'Refresh'" @click="refreshItems()">
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </l-dt-top>
    </template>

    <template v-slot:[`item.table_bloat`]="{ item }">
      {{ formatterDec2.format(item.table_bloat!) + ' %' }}
    </template>

    <template v-slot:[`item.index_bloat`]="{ item }">
      {{ formatterDec2.format(item.index_bloat!) + ' %' }}
    </template>

    <template v-slot:[`item.table_waste`]="{ item }">
      {{ formatter.format(item.table_waste!) }}
    </template>

    <template v-slot:[`item.index_waste`]="{ item }">
      {{ formatter.format(item.index_waste!) }}
    </template>

    <template #bottom>
      <l-dt-bottom :itemsPerPage="itemsPerPage" :page="page" :totalItemsIsEstimate="totalItemsIsEstimate" :totalItemsEstimated="totalItemsEstimated"></l-dt-bottom>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import type { AxiosInstance } from 'axios'
import { useJsonLs } from '../../composables/use_local_storage'
import { useTableExcelDlUrl, useTableHeaders, useTableState } from '../../composables/use_table'
import { LDtBottom, LDtTop } from '../tableElements'
import { type PgMonBloat } from '../../types/pgMon'

const props = defineProps<{
  ax: AxiosInstance
  baseUrl: string
  title?: string
}>()

const headers = [
  { title: 'Schema', key: 'table_schema' },
  { title: 'Table', key: 'table_name' },
  { title: 'Tbl bloat', key: 'table_bloat', align: 'end' },
  { title: 'Tbl waste', key: 'table_waste', align: 'end' },
  { title: 'Index', key: 'index_name' },
  { title: 'Idx bloat', key: 'index_bloat', align: 'end' },
  { title: 'Idx waste', key: 'index_waste', align: 'end' },
] as const
const { excludedHeaders, selectedHeaders } = useTableHeaders(headers)

const { excelDlUrl } = useTableExcelDlUrl(props.baseUrl)

const { items, itemsPerPage, page, sortBy, search, totalItems, totalItemsIsEstimate, totalItemsEstimated,
  loadItems, refreshItems
} = useTableState<PgMonBloat>({ ax: props.ax, baseUrl: props.baseUrl })


const formatter = new Intl.NumberFormat()
const formatterDec2 = new Intl.NumberFormat(undefined , { maximumFractionDigits: 2, minimumFractionDigits: 2})

const { resetTable } = useJsonLs({
  lsKey: 'pg_mon_bloat_dt',
  refs: {
    excludedHeaders,
    itemsPerPage,
    sortBy,
  },
})
</script>
