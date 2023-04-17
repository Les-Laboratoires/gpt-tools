import { Command } from "../app/commands.js"
import tracker from "../entities/tracker.js"

// update tracker category
new Command({
  name: "tracker",
  inGuild: true,
  run: async (message, parts, called) => {
    // todo: refactor tracker methods for a better usage
    tracker.updateTrackerCategory()
  },
})
