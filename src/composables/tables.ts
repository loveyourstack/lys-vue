import { Ref } from 'vue'

// is intended for use in event handler in template, but must be called via func in component or else reactivity doesn't work
export function useToggleHeader(headers: readonly any[], selectedHeaders: Ref<any>, excludedHeaders: Ref<string[]>, key: string) {

  // toggle inclusion of key in excludedHeaders
  excludedHeaders.value.includes(key) ? excludedHeaders.value = excludedHeaders.value.filter((v) => v != key) : excludedHeaders.value.push(key)

  // remove excludedHeaders from selectedHeaders
  selectedHeaders.value = headers.filter((v) => !excludedHeaders.value.includes(v.key))
}