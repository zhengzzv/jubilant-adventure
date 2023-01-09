<script setup lang="ts">
import { onMounted, ref } from "vue"
import { api } from "@/utils/service"

const code = ref("")

const refreshCode = () => {
  api.UserAPi.loginCode().then((res) => {
    code.value = "data:image/png;base64," + res.data
  })
}

onMounted(() => {
  refreshCode()
})
</script>

<template><img :src="code" alt="验证码" @click="refreshCode()" /></template>
