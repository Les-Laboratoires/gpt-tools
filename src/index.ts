import "dotenv/config"

import loadClient from "./app/client.js"
import loadCommands from "./app/commands.js"
import loadListeners from "./app/listeners.js"

await loadListeners()
await loadCommands()
await loadClient()
