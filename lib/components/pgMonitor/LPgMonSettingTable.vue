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
    item-value="name"
    @update:options="loadItems"
  >
    <template #top>
      <l-dt-top :ax="ax" :title="props.title ?? 'Settings'" :headers="headers" :excelDlUrl="excelDlUrl" v-model:excludedHeaders="excludedHeaders" @resetTable="resetTable()">
        <v-btn icon flat v-tooltip="'Refresh'" @click="refreshItems()">
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </l-dt-top>

      <v-row density="compact">
        <v-col>
          <l-pg-mon-setting-table-filters @update="refreshItems()" @updateDebounced="refreshItemsDebounced()"
            v-model:filterName="filterName"
            v-model:filterChanged="filterChanged"
          />
        </v-col>
      </v-row>
    </template>

    <template v-slot:[`item.changed`]="{ item }">
      <span v-if="item.changed">{{ item.boot_val ? item.boot_val : '(empty)' }}</span>
    </template>

    <template #bottom>
      <l-dt-bottom :itemsPerPage="itemsPerPage" :page="page" :totalItemsIsEstimate="totalItemsIsEstimate" :totalItemsEstimated="totalItemsEstimated"></l-dt-bottom>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type AxiosInstance } from 'axios'
import { getTextFilterUrlParam } from '../../functions/datatable'
import { useJsonLs } from '../../composables/use_local_storage'
import { useTableExcelDlUrl, useTableHeaders, useTableState } from '../../composables/use_table'
import { LPgMonSettingTableFilters } from '.'
import { LDtBottom, LDtTop } from '../tableElements'
import { type PgMonSetting } from '../../types/pgMon'

const props = defineProps<{
  ax: AxiosInstance
  baseUrl: string
  title?: string
}>()

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Setting', key: 'setting' },
  { title: 'Unit', key: 'unit' },
  { title: 'Description', key: 'short_desc' },
  { title: 'Boot val if changed', key: 'changed' },
] as const
const { excludedHeaders, selectedHeaders } = useTableHeaders(headers)

const { excelDlUrl } = useTableExcelDlUrl(props.baseUrl)

const { items, itemsPerPage, page, sortBy, search, totalItems, totalItemsIsEstimate, totalItemsEstimated,
  loadItems, refreshItems, refreshItemsDebounced
} = useTableState<PgMonSetting>({ ax: props.ax, baseUrl: props.baseUrl, getFilterStr })

const filterName = ref<string>()
const filterChanged = ref<boolean>()

const { resetTable } = useJsonLs({
  lsKey: 'pg_mon_setting_dt',
  refs: {
    excludedHeaders,
    filterName,
    filterChanged,
    itemsPerPage,
    sortBy,
  },
})

function getFilterStr(): string {
  let ret = ''
  
  if (filterChanged.value != undefined) { ret += '&changed=' + filterChanged.value }
  ret += getTextFilterUrlParam('name', filterName.value)

  return ret
}

</script>
