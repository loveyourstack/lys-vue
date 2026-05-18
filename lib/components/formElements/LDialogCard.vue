<template>
  <v-dialog v-model="showDialog" persistent width="auto">
    <v-card variant="flat">

      <v-card-title v-if="cardTitle" class="pt-6">
        {{ cardTitle }}
      </v-card-title>

      <v-card-text class="pa-5">
        <slot />
      </v-card-text>

      <v-card-actions v-if="$slots.actions">
        <slot name="actions" />
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

const props = defineProps<{
  cardTitle?: string
}>()

const showDialog = defineModel<boolean>()

</script>
