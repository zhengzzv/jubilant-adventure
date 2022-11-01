import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { removeToken, setToken } from "@/utils/cache/localStorage"
import { resetRouter } from "@/router"
import { api, setAccessToken } from "@/utils/service"
import { ElMessage } from "element-plus"
import { LoginRequest, UserDto } from "@/request/generator"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>("")
  const currentUser = ref<UserDto>()
  const roles = ref<string[]>([])

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = async (request: LoginRequest) => {
    const response = await api.UserAPi.login(request)
    const jwt = response.headers.authorization
    if (jwt) {
      token.value = jwt
      setAccessToken(jwt)
      setToken(jwt)
    } else {
      ElMessage.error("server not return jwt ")
      resetRouter()
    }
  }

  const fetchUserRole = async () => {
    await api.UserAPi.currentUser().then((res) => {
      const roleCode = res.data.role?.code
      if (roleCode) {
        setRoles([roleCode])
      }
    })
  }

  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return { token, roles, currentUser, setRoles, login, fetchUserRole, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
