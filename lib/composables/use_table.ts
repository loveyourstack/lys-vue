import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { type SortItem } from 'vuetify/lib/components/VDataTable/composables/sort.mjs'
//import type { DataTableHeader } from 'vuetify/lib/components/VDataTable/types.d.ts'
import type { AxiosInstance } from 'axios'
import { processURIOptions } from '../functions/datatable'
import { fetchDtItems } from '../functions/fetch'

export function useTableExcelDlUrl(baseUrl: MaybeRefOrGetter<string>, getFilterStr?: () => string) {

  const excelDlUrl = computed(() => {
    return toValue(baseUrl) + '?xformat=excel' + (getFilterStr ? getFilterStr() : '')
  }) 

  return { excelDlUrl }
}

// ----------------------------------------------------------------------------------------------------

type TableHeader = {
  key: string
  [key: string]: any
}

export function useTableHeaders<T extends TableHeader>(headers: MaybeRefOrGetter<readonly T[]>) {

  const excludedHeaders = ref<string[]>([])

  const selectedHeaders = computed(() => {
    const allHeaders = toValue(headers)
    return allHeaders.filter((h) => h.key && !excludedHeaders.value.includes(h.key))
  })

  return { excludedHeaders, selectedHeaders }
}

// ----------------------------------------------------------------------------------------------------

type UseTableStateParams = {
  ax: AxiosInstance

  // standard base url string or a computed ref that returns the base url
  baseUrl: MaybeRefOrGetter<string>

  defaultItemsPerPage?: number

  // optional custom request headers to pass to axios
  reqHeaders?: Record<string, string>

  // func to pre-process paging and sorting options, such as removing sort keys
  mapOptions?: (options: { page: number, itemsPerPage: number, sortBy: SortItem[] }) => { page: number, itemsPerPage: number, sortBy: SortItem[] }

  // func to apply changes to the url after options are processed but before getFilterStr
  mapUrl?: (url: string, options: { page: number, itemsPerPage: number, sortBy: SortItem[] }) => string

  // standard filtering func from the table filter component
  getFilterStr?: () => string

  // callback if fetch succeeds
  onFetchSuccess?: () => void
}

export function useTableState<T>(params: UseTableStateParams) {
  const items = ref<T[]>([])
  const itemsPerPage = ref(params.defaultItemsPerPage ?? 10)
  const page = ref(1)
  const sortBy = ref<SortItem[]>()
  const search = ref('')
  const totalItems = ref(0)
  const totalItemsIsEstimate = ref(false)
  const totalItemsEstimated = ref(0)

  function loadItems(options: { page: number, itemsPerPage: number, sortBy: SortItem[] }) {
    if (params.mapOptions) {
      options = params.mapOptions(options)
    }

    let myUrl = processURIOptions(toValue(params.baseUrl), options)

    if (params.mapUrl) {
      myUrl = params.mapUrl(myUrl, options)
    }
    if (params.getFilterStr) {
      myUrl += params.getFilterStr()
    }

    fetchDtItems({ 
      ax: params.ax,
      myUrl, 
      page: options.page, 
      itemsPerPage: options.itemsPerPage, 
      items, 
      totalItems, 
      totalItemsIsEstimate, 
      totalItemsEstimated, 
      reqHeaders: params.reqHeaders,
      onSuccess: params.onFetchSuccess 
    })
  }

  function refreshItems() {
    search.value = String(Date.now())
  }
  const refreshItemsDebounced = useDebounceFn(() => {
    search.value = String(Date.now())
  }, import.meta.env.VITE_DEBOUNCE_MS, { maxWait: import.meta.env.VITE_MAX_DEBOUNCE_MS })

  return {
    items, itemsPerPage, page, sortBy, search, totalItems, totalItemsIsEstimate, totalItemsEstimated,
    loadItems, refreshItems, refreshItemsDebounced
  }
}