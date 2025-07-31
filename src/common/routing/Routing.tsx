import { Main } from "@/app/Main.tsx"
import { PageNotFound } from "@/common/components"
import { Login } from "@/features/auth/ui/Login/Login"
import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Login: "login",
  NotFound: "*",
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route path={Path.Main} element={<Main />} />
      <Route path={Path.Login} element={<Login />} />
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
