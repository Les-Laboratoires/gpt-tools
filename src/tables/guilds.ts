import { Table } from "@ghom/orm"

export interface GuildTable {
  id: string
  prefix: string
  userArriveMessage?: string
  botArriveMessage?: string
  userLeaveMessage?: string
  botLeaveMessage?: string
  userDefaultRole?: string
  botDefaultRole?: string
  trackerCategory?: string
  memberTrackerPattern: string
  onlineTrackerPattern: string
  messageTrackerPattern: string
}

export default new Table({
  name: "guilds",
  setup: (table) => {
    table.string("id").primary()
    table.string("prefix").defaultTo("!")
    table.string("userWelcomeMessage").nullable()
    table.string("botWelcomeMessage").nullable()
    table.string("userLeaveMessage").nullable()
    table.string("botLeaveMessage").nullable()
    table.string("userDefaultRole").nullable()
    table.string("botDefaultRole").nullable()
    table.string("trackerCategory").nullable()
    table.string("memberTrackerPattern").defaultTo("📈｜$count membres")
    table.string("onlineTrackerPattern").defaultTo("🟢｜$count connectés")
    table.string("messageTrackerPattern").defaultTo("📨｜$count messages")
  },
})
