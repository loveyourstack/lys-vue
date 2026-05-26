<template>
  <v-row density="compact">
    <v-col class="d-flex align-center ga-6">

      <v-btn icon @click="emit('cancel')">
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-btn>

      <v-btn color="primary" :loading="props.saving" :disabled="props.saveDisabled" @click="emit('save')">{{ props.saveBtnLabel }}</v-btn>

      <v-fade-transition mode="out-in">
        <v-chip v-if="props.showSaved" color="success">Saved</v-chip>
      </v-fade-transition>

      <slot name="extra" />

    </v-col>
  </v-row>
</template>

<script lang="ts" setup>

const props = defineProps<{
  saving: boolean
  showSaved: boolean
  saveBtnLabel: string
  saveDisabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save'): void
}>()

// the extra slot is for actions other than Cancel and Save. Add a v-spacer to float it to the right.

</script>
