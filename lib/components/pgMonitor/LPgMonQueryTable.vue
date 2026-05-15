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
    item-value="pid"
    @update:options="loadItems"
  >
    <template #top>
      <l-dt-top :ax="ax" :title="props.title ?? 'Active queries'" :headers="headers" :excelDlUrl="excelDlUrl" v-model:excludedHeaders="excludedHeaders" @resetTable="resetTable()">
        <v-btn icon flat v-tooltip="'Refresh'" @click="refreshItems()">
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </l-dt-top>
    </template>

    <template v-slot:[`item.query_start`]="{ item }">
      <span>{{ useDateFormat(item.query_start, 'DD MMM YYYY HH:mm:ss') }}</span>
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
import { type PgMonQuery } from '../../types/pgMon'

const props = defineProps<{
  ax: AxiosInstance
  baseUrl: string
  title?: string
}>()

const headers = [
  { title: 'PID', key: 'pid' },
  { title: 'State', key: 'state' },
  { title: 'Query start', key: 'query_start' },
  { title: 'Application', key: 'application_name' },
  { title: 'User', key: 'usename' },
  { title: 'IP', key: 'client_addr' },
  { title: 'Query', key: 'query' },
] as const
const { excludedHeaders, selectedHeaders } = useTableHeaders(headers)

const { excelDlUrl } = useTableExcelDlUrl(props.baseUrl)

const { items, itemsPerPage, page, sortBy, search, totalItems, totalItemsIsEstimate, totalItemsEstimated,
  loadItems, refreshItems
} = useTableState<PgMonQuery>({ ax: props.ax, baseUrl: props.baseUrl })

const { resetTable } = useJsonLs({
  lsKey: 'pg_mon_query_dt',
  refs: {
    excludedHeaders,
    itemsPerPage,
    sortBy,
  },
})
</script>
