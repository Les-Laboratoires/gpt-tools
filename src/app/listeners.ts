import path from "path"
import * as handler from "@ghom/handler"

const listeners = new handler.Handler("dist/listeners")

listeners.on(
  "load",
  (file) => import("file://" + path.join(process.cwd(), file))
)

export default () => listeners.load()
