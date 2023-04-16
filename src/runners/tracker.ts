import cron from "node-cron"
import { updateAllTrackers } from "../utils/tracker.js"

// Update all trackers every 10 minutes if a change has been made
cron.schedule("*/10 * * * *", updateAllTrackers)
