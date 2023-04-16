import path from "path"
import chalk from "chalk"
import * as handler from "@ghom/handler"
import * as logger from "@ghom/logger"

const runnerHandler = new handler.Handler("dist/runners")
const runnerLogger = new logger.Logger({
  section: "runner",
})

runnerHandler.on("load", (file) => {
  runnerLogger.log(
    `loaded runner ${chalk.blueBright(path.basename(file, ".js"))}`
  )
  return import("file://" + path.join(process.cwd(), file))
})

export default () => runnerHandler.load()
