<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { UserDto } from "@/request/generator"
import { api } from "@/utils/service"
import { ElMessageBox } from "element-plus"

//const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<Array<UserDto>>()

const fetchTableData = () => {
  loading.value = true
  api.UserAPi.listByPage(1, 10)
    .then((res) => (tableData.value = res.data.data))
    .catch(() => (tableData.value = new Array<UserDto>()))
    .finally(() => (loading.value = false))
}
const handleUpdate = (userDto: UserDto) => {
  console.log("update user " + userDto)
}

const handleDelete = (row: UserDto) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    console.log("delete user" + row)
  })
}

onMounted(() => fetchTableData())
</script>
<template>
  <div class="app-container">
    <div class="table-wrapper">
      <el-table :data="tableData" header-cell-class-name="table-header">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="nickName" label="真实姓名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="createAt" label="创建时间" align="center" />
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
<style lang="scss" scoped></style>
