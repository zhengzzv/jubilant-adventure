<script lang="ts" setup>
import { ref } from "vue"
import { useUserStore } from "@/store/modules/user"
import AdminDashboard from "./admin/index.vue"
import EditorDashboard from "./editor/index.vue"

type CurrentRoleType = "SUPER_ADMIN" | "editor"

const userStore = useUserStore()
const currentRole = ref<CurrentRoleType>("SUPER_ADMIN")
if (!userStore.roles.includes("SUPER_ADMIN")) {
  currentRole.value = "editor"
}
</script>

<template>
  <component :is="currentRole === 'SUPER_ADMIN' ? AdminDashboard : EditorDashboard" />
</template>
