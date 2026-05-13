import { onBeforeMount, watch, type Ref } from 'vue'

type UseJsonLsParams = {
  lsKey: string
  refs: Record<string, Ref<any>>
}

export function useJsonLs(params: UseJsonLsParams) {

  function resetTable() {
    localStorage.removeItem(params.lsKey)
    window.location.reload()
  }

  watch(
    // watch source: returns an array of all ref values so that each one is watched
    () => Object.values(params.refs).map((r) => r.value),

    // watch callback: convert all ref values into a keyed JSON object and save to localStorage
    () => {
      const snapshot: Record<string, any> = {}
      Object.entries(params.refs).forEach(([key, r]) => {
        snapshot[key] = r.value
      })
      localStorage.setItem(params.lsKey, JSON.stringify(snapshot))
    },

    // ensure nested changes (e.g. array/object mutations such as excludedHeaders) trigger the watcher
    { deep: true }
  )

  onBeforeMount(() => {
    const raw = localStorage.getItem(params.lsKey)
    if (!raw) return

    let parsed: Record<string, any>
    try {
      parsed = JSON.parse(raw)
    } catch {
      return
    }

    // read LS values into refs where the ref name matches the LS key. Ignore any LS keys that don't have a matching ref
    Object.entries(params.refs).forEach(([key, r]) => {
      if (parsed[key] !== undefined) {
        r.value = parsed[key]
      }
    })
  })

  return { resetTable }
}
