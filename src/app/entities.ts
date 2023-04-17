import path from "path"
import chalk from "chalk"
import { Handler } from "@ghom/handler"
import { Logger } from "@ghom/logger"

const entityHandler = new Handler("dist/entities")
const entityLogger = new Logger({ section: "Entities" })

entityHandler.on("load", (file) => {
  entityLogger.log(
    `loaded entity ${chalk.blueBright(path.basename(file, ".js"))}`
  )
  return import("file://" + path.join(process.cwd(), file))
})

export const entities: Entity[] = []

export abstract class Entity {
  abstract init(): void | Promise<void>

  constructor(public readonly name: string) {
    entities.push(this)
  }
}

export default async () => {
  await entityHandler.load()

  for (const entity of entities) {
    await entity.init()
  }
}
