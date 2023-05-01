import path from "path"
import chalk from "chalk"
import { Handler } from "@ghom/handler"
import { Logger } from "@ghom/logger"

const handler = new Handler("dist/entities", {
  logger: new Logger({ section: "Entities" }),
  loggerPattern: `loaded entity ${chalk.blueBright("$filename")}`,
  loader: async (filepath) => import("file://" + filepath),
})

export const entities = handler.elements

export abstract class Entity {
  abstract init(): void | Promise<void>
}

export default async () => {
  await handler.init()

  for (const [, entity] of entities) {
    await entity.init()
  }
}
