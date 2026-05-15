import { computed, onMounted, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import { type VForm } from 'vuetify/components'
import type { AxiosInstance } from 'axios'
import { fetchOnce } from '../functions/fetch'
import { callDelete } from '../functions/form'

type UseFormCrudParams<T> = {
  ax: AxiosInstance
  id: number
  baseUrl: string

  // optional custom request headers to pass to axios
  reqHeaders?: Record<string, string>

  // factory function that returns a blank item for new records
  newItem?: () => T

  // maps the item to the API input shape for POST/PUT
  getInput?: (item: T) => any

  // lifecycle callbacks
  onCreate?: (id: number) => void
  onDelete?: () => void
  onLoad?: (id: number) => void
  onUpdate?: () => void
}

// useFormCrud is for standard CRUD forms (GET/POST/PUT/DELETE)
export function useFormCrud<T>(params: UseFormCrudParams<T>) {
  const item = ref<T>() as Ref<T | undefined>
  const itemUrl = `${params.baseUrl}/${params.id}`

  const saving = ref(false)
  const showSaved = ref(false)
  const saveBtnLabel = ref(params.id !== 0 ? 'Save' : 'Create')
  const itemForm = ref<InstanceType<typeof VForm>>()

  const isNew = computed(() => params.id === 0)

  function deleteItem() {
    callDelete({
      ax: params.ax,
      myUrl: itemUrl,
      reqHeaders: params.reqHeaders,
      onSuccess: () => { if (params.onDelete) { params.onDelete() } },
    })
  }

  function loadItem() {
    fetchOnce({ 
      ax: params.ax, 
      myUrl: itemUrl, 
      result: item as Ref<T>, 
      reqHeaders: params.reqHeaders,
      onSuccess: () => { if (params.onLoad) { params.onLoad(params.id) }},
    })
  }

  async function saveItem() {
    const result = await itemForm.value?.validate()
    if (!result?.valid) { return }

    saving.value = true

    const input = params.getInput ? params.getInput(item.value!) : item.value

    // if an existing item was loaded
    if (!isNew.value) {

      // change it with PUT and reload it to ensure the form shows latest data from server
      await params.ax.put(itemUrl, input, params.reqHeaders ? { headers: params.reqHeaders } : undefined)
        .then(() => {
          showSaved.value = true
          setTimeout(() => { showSaved.value = false }, import.meta.env.VITE_FADE_MS)
          loadItem()
          if (params.onUpdate) { params.onUpdate() }
        })
        .catch() // handled by interceptor
        .finally(() => { saving.value = false })
      return
    }

    // otherwise new item: create it with POST
    await params.ax.post(params.baseUrl, input, params.reqHeaders ? { headers: params.reqHeaders } : undefined)
      .then(response => {
        showSaved.value = true
        setTimeout(() => { showSaved.value = false }, import.meta.env.VITE_FADE_MS)
        if (params.onCreate) { params.onCreate(response.data.data) }
      })
      .catch() // handled by interceptor
      .finally(() => { saving.value = false })
  }

  onMounted(() => {
    if (!isNew.value) {
      loadItem()
    } else {
      item.value = params.newItem ? params.newItem() : {} as T
    }
  })

  return {
    item, itemForm, itemUrl, isNew, saving, saveBtnLabel, showSaved,
    deleteItem, loadItem, saveItem,
  }
}

// ----------------------------------------------------------------------------------------------------

type UseFormPatchParams = {
  ax: AxiosInstance
  patch_id: MaybeRefOrGetter<number | undefined>
  patchUrl: string

  // optional custom request headers to pass to axios
  reqHeaders?: Record<string, string>

  getPatchInput: () => any

  loadItem: () => void

  // lifecycle callbacks
  onUpdate?: () => void
}

// useFormPatch is for forms that use PATCH, such as changing item metadata
export function useFormPatch(params: UseFormPatchParams) {

  const saving = ref(false)
  const showSaved = ref(false)
  const itemForm = ref<InstanceType<typeof VForm>>()

  async function saveItem() {
    const result = await itemForm.value?.validate()
    if (!result?.valid) { return }

    const patchId = toValue(params.patch_id)
    if (patchId === undefined) { return }

    saving.value = true

    const input = params.getPatchInput()

    await params.ax.patch(`${params.patchUrl}/${patchId}`, input, params.reqHeaders ? { headers: params.reqHeaders } : undefined)
      .then(() => {
        showSaved.value = true
        setTimeout(() => { showSaved.value = false }, import.meta.env.VITE_FADE_MS)
        params.loadItem()
        if (params.onUpdate) { params.onUpdate() }
      })
      .catch() // handled by interceptor
      .finally(() => { saving.value = false })
  }

  return {
    itemForm, saving, showSaved,
    saveItem,
  }
}

