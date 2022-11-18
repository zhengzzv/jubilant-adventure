<script lang="ts" setup>
import { ref } from "vue"
import { UserDto } from "@/request/generator"

const tableData = ref<UserDto>()
</script>
<template>
  <div class="app-container">
    <div class="table-wrapper">
      <el-table :data="tableData" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  margin-bottom: 20px;
  :deep(.table-header) {
    background-color: var(--el-fill-color-light) !important;
  }
}
</style>
