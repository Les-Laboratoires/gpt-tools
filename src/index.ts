import "dotenv/config"

import loadClient from "./app/client.js"
import loadRunners from "./app/runners.js"
import loadDatabase from "./app/database.js"
import loadCommands from "./app/commands.js"
import loadListeners from "./app/listeners.js"

await loadListeners()
await loadCommands()
await loadDatabase()
await loadRunners()
await loadClient()
