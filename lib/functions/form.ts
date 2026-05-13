import { type Ref } from 'vue'
import type { AxiosInstance } from 'axios'

type callDeleteParams = {
  ax: AxiosInstance
  myUrl: string
  reqHeaders?: Record<string, string>
  onSuccess?: Function
}

export function callDelete(params: callDeleteParams) {

  if (!confirm('Are you sure?')) {
    return
  }

  params.ax.delete(params.myUrl, { headers: params.reqHeaders })
    .then(() => {
      if (params.onSuccess) {
        params.onSuccess()
      }
    })
    .catch() // handled by interceptor
}

type callPostParams = {
  ax: AxiosInstance
  myUrl: string
  reqHeaders?: Record<string, string>
  onSuccess?: Function
}

export function callPost(params: callPostParams) {

  if (!confirm('Are you sure?')) {
    return
  }

  params.ax.post(params.myUrl, {}, { headers: params.reqHeaders })
    .then(() => {
      if (params.onSuccess) {
        params.onSuccess()
      }
    })
    .catch() // handled by interceptor
}

export function setAutocompleteMenus(autoMenuOpen: Ref<boolean>, outerMenuOpen: Ref<boolean>, isOpen: boolean) {
  autoMenuOpen.value = isOpen
  if (!isOpen) {
    outerMenuOpen.value = false
  }
}