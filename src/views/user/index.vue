<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { UserDto } from "@/request/generator"
import { api } from "@/utils/service"

const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<Array<UserDto>>()

const fetchTableData = () => {
  loading.value = true
  api.UserAPi.listByPage(1, 10)
    .then((res) => (tableData.value = res.data.data))
    .catch(() => (tableData.value = new Array<UserDto>()))
    .finally(() => (loading.value = false))
}
onMounted(() => fetchTableData())
</script>
<template>
  <div class="app-container">
    <div class="table-wrapper">
      <el-table :data="tableData" header-cell-class-name="table-header">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="roles" label="角色" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.roles === 'SUPER_ADMIN'" effect="plain">admin</el-tag>
            <el-tag v-else type="warning" effect="plain">{{ scope.row.role?.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
            <el-tag v-else type="danger" effect="plain">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="scope">
            <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style scoped></style>
