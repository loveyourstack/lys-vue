import { type Ref } from 'vue'

export function setAutocompleteMenus(autoMenuOpen: Ref<boolean>, outerMenuOpen: Ref<boolean>, isOpen: boolean) {
  autoMenuOpen.value = isOpen
  if (!isOpen) {
    outerMenuOpen.value = false
  }
}