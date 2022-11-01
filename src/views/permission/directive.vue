<script lang="ts" setup>
import { ref } from "vue"
import { checkPermission } from "@/utils/permission" // checkPermission 权限判断函数
import SwitchRoles from "./components/SwitchRoles.vue"

/** key 是为了能每次切换权限的时候重新初始化指令 */
const key = ref(1)
const handleRolesChange = () => {
  key.value++
}
</script>

<template>
  <div class="app-container">
    <SwitchRoles @change="handleRolesChange" />
    <div :key="key" class="margin-top">
      <div>
        <span v-permission="['SUPER_ADMIN']" class="permission-alert">
          只有
          <el-tag>admin</el-tag>可以看见这个
        </span>
        <el-tag v-permission="['SUPER_ADMIN']" class="permission-code" type="info" size="large">
          v-permission="['SUPER_ADMIN']"
        </el-tag>
      </div>
      <div>
        <span v-permission="['editor']" class="permission-alert">
          只有
          <el-tag>editor</el-tag>可以看见这个
        </span>
        <el-tag v-permission="['editor']" class="permission-code" type="info" size="large">
          v-permission="['editor']"
        </el-tag>
      </div>
      <div>
        <span v-permission="['SUPER_ADMIN', 'editor']" class="permission-alert">
          两者
          <el-tag>admin</el-tag>和 <el-tag>editor</el-tag>都可以看见这个
        </span>
        <el-tag v-permission="['SUPER_ADMIN', 'editor']" class="permission-code" type="info" size="large">
          v-permission="['SUPER_ADMIN', 'editor']"
        </el-tag>
      </div>
    </div>
    <div :key="'checkPermission' + key" class="margin-top">
      <el-tag type="info" size="large">
        在某些情况下，不适合使用 v-permission。例如: Element Plus 的 el-tab-pane 或 el-table-column 以及其它动态渲染 Dom
        的场景。你只能通过手动设置 v-if 来实现。
      </el-tag>
      <el-tabs type="border-card" class="margin-top">
        <el-tab-pane v-if="checkPermission(['SUPER_ADMIN'])" label="SUPER_ADMIN">
          admin 可以看见这个
          <el-tag class="permission-code" type="info"> v-if="checkPermission(['SUPER_ADMIN'])" </el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['editor'])" label="editor">
          editor 可以看见这个
          <el-tag class="permission-code" type="info"> v-if="checkPermission(['editor'])" </el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['SUPER_ADMIN', 'editor'])" label="admin 和 editor">
          两者 admin 和 editor 都可以看见这个
          <el-tag class="permission-code" type="info"> v-if="checkPermission(['SUPER_ADMIN', 'editor'])" </el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.permission-alert {
  width: 320px;
  margin-top: 15px;
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
}

.permission-code {
  margin-left: 15px;
}

.margin-top {
  margin-top: 30px;
}
</style>
