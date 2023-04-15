import { ORM } from "@ghom/orm"
import { Logger } from "@ghom/logger"

export const database = new ORM({
  tablePath: "dist/tables",
  logger: new Logger({
    section: "Database",
  }),
})

export default () => database.init()
