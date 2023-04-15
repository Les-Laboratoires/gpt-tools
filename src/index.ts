import "dotenv/config"

import loadClient from "./app/client.js"
import loadDatabase from "./app/database.js"
import loadCommands from "./app/commands.js"
import loadListeners from "./app/listeners.js"

await loadListeners()
await loadCommands()
await loadDatabase()
await loadClient()
