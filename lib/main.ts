import type { App, Plugin } from 'vue'

export * from './types'
export * from './functions'
export * from './composables'

import * as arrayControls from './components/arrayControls'
export * from './components/arrayControls'

import * as filterControls from './components/filterControls'
export * from './components/filterControls'

import * as formElements from './components/formElements'
export * from './components/formElements'

import * as pgMonitor from './components/pgMonitor'
export * from './components/pgMonitor'

import * as tableElements from './components/tableElements'
export * from './components/tableElements'

const plugin: Plugin = {
  install(app: App) {
    Object.entries(arrayControls).forEach(([name, component]) => {
      app.component(name, component as any)
    }),
    Object.entries(formElements).forEach(([name, component]) => {
      app.component(name, component as any)
    }),
    Object.entries(filterControls).forEach(([name, component]) => {
      app.component(name, component as any)
    }),
    Object.entries(pgMonitor).forEach(([name, component]) => {
      app.component(name, component as any)
    }),
    Object.entries(tableElements).forEach(([name, component]) => {
      app.component(name, component as any)
    })
  },
}

export default plugin