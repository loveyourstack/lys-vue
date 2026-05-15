<template>
  <v-row density="comfortable">
    <v-col class="d-flex align-center">
      <v-data-table-footer v-if="props.totalItemsIsEstimate"
        :items-per-page-options="itemsPerPageOptions"
        :page-text="getPageTextEstimated(props.page, props.itemsPerPage, props.totalItemsEstimated)"
        show-current-page
      ></v-data-table-footer>
      <v-data-table-footer v-else
        :items-per-page-options="itemsPerPageOptions"
        show-current-page
      ></v-data-table-footer>
    </v-col>

    <slot></slot>
  </v-row>
</template>

<script lang="ts" setup>

const props = defineProps<{
  itemsPerPage: number
  page: number
  totalItemsIsEstimate: boolean
  totalItemsEstimated: number
}>()

const itemsPerPageOptions = [
  {value: 5, title: '5'},
  {value: 10, title: '10'},
  {value: 25, title: '25'},
  {value: 50, title: '50'},
  {value: 100, title: '100'}
]

function getPageTextEstimated(page: number, itemsPerPage: number, totalItemsEstimated: number) {
  if (totalItemsEstimated === 0) {
    return '0 to 0 of ~0'
  }

  const start = (page - 1) * itemsPerPage + 1
  const end = Math.min(page * itemsPerPage, totalItemsEstimated)

  return `${start} to ${end} of ~${totalItemsEstimated.toLocaleString()}`
}

</script>