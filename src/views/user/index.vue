<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { RoleDto, UserDto } from "@/request/generator"
import { api } from "@/utils/service"
import { CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { ElMessageBox, ElMessage, FormInstance, FormRules } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { phoneReg, emailReg } from "@/utils/validate"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const roles = ref<Array<RoleDto>>()

const fetchRoles = () => {
  api.RoleApi.listRoleByPage(1, 999)
    .then((res) => (roles.value = res.data.data))
    .catch(() => (roles.value = new Array<RoleDto>()))
}

// start create
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  id: 0,
  username: "",
  nickName: "",
  password: "",
  email: "",
  phone: "",
  roleId: ""
})
const formRules: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  nickname: [{ required: true, trigger: "blur", message: "请输入昵称" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  phone: [
    {
      required: false,
      pattern: phoneReg,
      message: "请输入合法的手机号",
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      pattern: emailReg,
      message: "请输入合法的邮箱",
      trigger: "blur"
    }
  ],
  roleId: [{ required: true, trigger: "blur", message: "请选择角色" }]
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value == undefined) {
        api.UserAPi.createUser({
          username: formData.username,
          password: formData.password,
          nickName: formData.nickName,
          avatar: "",
          phone: formData.phone,
          role: Number.parseInt(formData.roleId),
          email: formData.email
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          fetchTableData()
        })
      } else {
        api.UserAPi.updateUser({
          id: formData.id,
          avatar: "",
          nickName: formData.nickName,
          email: formData.email,
          phone: formData.phone,
          role: Number.parseInt(formData.roleId),
          updateBy: 0
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          fetchTableData()
        })
      }
    } else {
      return false
    }
  })
}

const resetForm = () => {
  currentUpdateId.value = undefined
  formData.id = -1
  formData.username = ""
  formData.password = ""
  formData.nickName = ""
  formData.email = ""
  formData.phone = ""
  formData.roleId = ""
}
//start delete
const handleDelete = (row: UserDto) => {
  ElMessageBox.confirm(`确认删除用户：${row.username} ？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    api.UserAPi.deleteUser(row.id).then(() => {
      ElMessage.success("删除成功")
      fetchTableData()
    })
  })
}
//end delete

//start update
const currentUpdateId = ref<undefined | string>(undefined)

const handleUpdate = (userDto: UserDto) => {
  formData.id = userDto.id
  formData.username = userDto.username
  formData.nickName = userDto.nickName
  formData.email = userDto.email
  formData.phone = userDto.phone
  formData.roleId = userDto.role!.id.toString()
  currentUpdateId.value = userDto.id.toString()
  dialogVisible.value = true
}
//end update

// start select
const tableData = ref<Array<UserDto>>()

const fetchTableData = () => {
  loading.value = true
  api.UserAPi.listUserByPage(paginationData.page, paginationData.size)
    .then((res) => {
      tableData.value = res.data.data
      paginationData.totalCount = res.data.totalCount
    })
    .catch(() => (tableData.value = new Array<UserDto>()))
    .finally(() => (loading.value = false))
}

const handleRefresh = () => {
  fetchTableData()
}
//end select

/** 监听分页参数变化*/
watch([() => paginationData.page, () => paginationData.size], fetchTableData, { immediate: true })
</script>
<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
        </div>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" header-cell-class-name="table-header">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="nickName" label="昵称" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="role.name" label="角色" align="center" />
          <el-table-column prop="createAt" label="创建时间" align="center" />
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.totalCount"
          :page-size="paginationData.size"
          :currentPage="paginationData.page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      @open="fetchRoles"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="auto">
        <el-form-item v-if="currentUpdateId === undefined" prop="username" label="账号">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item v-if="currentUpdateId === undefined" prop="password" label="密码">
          <el-input type="password" v-model="formData.password" show-password />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item prop="nickName" label="昵称">
          <el-input v-model="formData.nickName" />
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <el-select v-model="formData.roleId" placeholder="选择用户角色">
            <el-option v-for="item in roles" :key="item.id.toString()" :label="item.name" :value="item.id.toString()" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.table-wrapper {
  margin-bottom: 20px;
  :deep(.table-header) {
    background-color: var(--el-fill-color-light) !important;
  }
}
.el-select {
  width: 100%;
}
.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
