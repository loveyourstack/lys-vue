import { ref, type Ref, watchEffect } from 'vue'
import { type AxiosInstance } from 'axios'
import { type GetMetadata } from '../types/base'

type FetchOnceParams<T> = {
  ax: AxiosInstance
  myUrl: string
  result: Ref<T | T[]>
  isLoading?: Ref<boolean>
  metaData?: Ref<GetMetadata>
  reqHeaders?: Record<string, string>
  onSuccess?: () => void
}

// fetchOnce loads the response data into the result ref. It is not reactive to changes in itemUrl and is intended for one-off fetches
export function fetchOnce<T>(params: FetchOnceParams<T>) {

  if (params.isLoading) { 
    params.isLoading.value = true
  }

  params.ax.get(params.myUrl, { headers: params.reqHeaders })
    .then(resp => {
      params.result.value = resp.data.data
      
      if (params.metaData) {
        params.metaData.value = resp.data.metadata
      }

      if (params.onSuccess) {
        params.onSuccess()
      }
    })
    .catch() // handled by interceptor
    .finally(() => { 
      if (params.isLoading) { params.isLoading.value = false } 
    })
}


type FetchDtItemsParams<T> = {
  ax: AxiosInstance
  myUrl: string,
  page: number,
  itemsPerPage: number,
  items: Ref<T[]>,
  totalItems: Ref<number>
  totalItemsIsEstimate: Ref<boolean>
  totalItemsEstimated: Ref<number>
  reqHeaders?: Record<string, string>
  onSuccess?: () => void
}

// fetchDtItems loads multiple items of type T into the items ref and also updates the totalItems metadata refs
// is intended for use with data tables and is reactive to changes in the url, page, and itemsPerPage params
export function fetchDtItems<T>(params: FetchDtItemsParams<T>) {

  const metadata = ref<GetMetadata | null>()
  
  watchEffect(() => {
  
    params.ax.get(params.myUrl, { headers: params.reqHeaders })
      .then(resp => {
        params.items.value = resp.data.data
        metadata.value = resp.data.metadata

        params.totalItemsIsEstimate.value = metadata.value!.total_count_is_estimated
        if (params.totalItemsIsEstimate.value) {
          params.totalItemsEstimated.value = metadata.value!.total_count

          // enable next page button even if estimate is too low
          params.totalItems.value = Math.max(params.totalItemsEstimated.value, params.page * params.itemsPerPage + 1)
        } else {
          params.totalItems.value = metadata.value!.total_count
        }

        if (params.onSuccess) {
          params.onSuccess()
        }
      })
      .catch() // handled by interceptor
  })
}