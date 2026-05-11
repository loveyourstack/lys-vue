# Lys-Vue

Vue, Vuetify and Typescript code for [LoveYourStack](https://github.com/loveyourstack/lys) projects.

## Install

```bash
pnpm add lys-vue
```

## ESM-only

This package is ESM-only and should be imported with ESM syntax.

```ts
import LysVue, { AdjustColsList } from 'lys-vue'
```

## Peer dependencies

- vue ^3.5.0
- vuetify ^4.0.0

## Usage

```ts
import { createApp } from 'vue'
import LysVue from 'lys-vue'

const app = createApp(App)
app.use(LysVue)
```

## Build

```bash
pnpm build
```
