<template>
  <v-menu v-model="menuModel" :close-on-content-click="false" transition="scale-transition" offset="5px 0px">

    <template v-slot:activator="{ props }">
      <v-chip v-bind="props" size="large" variant="flat">
        <template #prepend>
          <v-icon class="mr-1" :icon="applied ? 'mdi-check' : 'mdi-plus'" :color="applied ? 'primary' : undefined" />
        </template>

        <span>{{ name }}</span>
        <span v-if="filterText" class="ml-1 mr-1">|</span>
        <span :class="{ 'text-primary': applied }">{{ filterText }}</span>

        <template #close>
          <v-icon v-if="applied" class="mr-1" icon="mdi-close-circle" @click.stop="emit('close')"/>
        </template>
      </v-chip>
    </template>

    <v-card :width="300" class="pa-2">
      <slot></slot>
    </v-card>
    
  </v-menu>
</template>

<script lang="ts" setup>

const props = defineProps<{
  name: string
  filterText: string | undefined
  applied: boolean
}>()

const menuModel = defineModel<boolean | undefined>('menu', { required: false })

const emit = defineEmits<{
  (e: 'close'): void
}>()

</script>