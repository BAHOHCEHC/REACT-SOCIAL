import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { useTheme } from "@heroui/react"
import { Provider } from "react-redux"
import { App } from "./App"
import { store } from "./app/store"
import "./index.css"

const AppTheme = () => {
  useTheme("dark")

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <AppTheme />
    </StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
