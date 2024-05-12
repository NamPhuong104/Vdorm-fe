import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios, { axiosAuth } from "./axios"

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

export const useAxiosAuth = () => {
  const { data: session, status, update } = useSession()

  useEffect(() => {
    let newAccessToken: string

    const refreshToken = async () => {
      const res = await axios.post("/auth/refresh", {
        refreshToken: session?.refresh_token
      })

      await update({
        ...session,
        access_token: res?.data?.data?.access_token,
        refresh_token: res?.data?.data?.refresh_token
      })

      newAccessToken = res?.data?.data?.access_token
    }

    if (status === "authenticated") {
      const requestIntercept = axiosAuth.interceptors.request.use(
        (config) => {
          if (!config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${session?.access_token}`
          }

          return config
        },
        (error) => Promise.reject(error)
      )

      const responseIntercept = axiosAuth.interceptors.response.use(
        (response) => response,
        async (error) => {
          const prevRequest = error.config

          if (error.response.status === 401 && !prevRequest.sent) {
            prevRequest.sent = true
            await refreshToken()
          }

          if (newAccessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
            return axiosAuth(prevRequest)
          }

          return Promise.reject(error)
        }
      )

      return () => {
        axiosAuth.interceptors.request.eject(requestIntercept)
        axiosAuth.interceptors.response.eject(responseIntercept)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return axiosAuth
}
