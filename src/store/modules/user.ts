import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { resetRouter } from "@/router"
import { api } from "@/utils/service"
import { ElMessage } from "element-plus"
import { LoginCommand, UserDto } from "@/request/generator"

export const useUserStore = defineStore("user", () => {
  const currentUser = ref<UserDto>()
  const roles = ref<string[]>([])

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = async (request: LoginCommand) => {
    const response = await api.UserAPi.login(request)
    if (response.status == 200) {
      ElMessage.success("login success")
    } else {
      ElMessage.error("login error")
      resetRouter()
    }
  }

  const fetchUserRole = async () => {
    await api.UserAPi.currentUser().then((res) => {
      currentUser.value = res.data
      const roleCode = res.data.role?.code
      if (roleCode) {
        setRoles([roleCode])
      }
    })
  }

  /** 登出 */
  const logout = async () => {
    await api.UserAPi.logout().then(() => {
      console.log("退出登陆")
      roles.value = []
      resetRouter()
    })
  }
  return { roles, currentUser, setRoles, login, fetchUserRole, logout }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
