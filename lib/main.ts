import type { App, Plugin } from 'vue'

import AdjustColsList from './components/AdjustColsList.vue'
export { AdjustColsList }

//export * from './types'

const plugin: Plugin = {
  install(app: App) {
    app.component('AdjustColsList', AdjustColsList)
  },
}

export default plugin