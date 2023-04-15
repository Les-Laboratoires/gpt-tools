import { Table } from "@ghom/orm"

export interface GuildTable {
  id: string
  prefix: string
  arriveMessageChannel?: string
  leaveMessageChannel?: string
  userArriveMessage: string
  botArriveMessage: string
  userLeaveMessage: string
  botLeaveMessage: string
  userDefaultRole?: string
  botDefaultRole?: string
  trackerCategory?: string
  memberTrackerPattern: string
  onlineTrackerPattern: string
  messageTrackerPattern: string
}

export default new Table<GuildTable>({
  name: "guilds",
  setup: (table) => {
    table.string("id").primary()
    table.string("prefix").defaultTo("!")
    table.string("arriveMessageChannel").nullable()
    table.string("leaveMessageChannel").nullable()
    table.string("userArriveMessage").defaultTo("Bienvenue $user !")
    table.string("botArriveMessage").defaultTo("$user est notre nouveau bot !")
    table.string("userLeaveMessage").defaultTo("$user est parti...")
    table.string("botLeaveMessage").defaultTo("Le bot $user à été supprimé.")
    table.string("userDefaultRole").nullable()
    table.string("botDefaultRole").nullable()
    table.string("trackerCategory").nullable()
    table.string("memberTrackerPattern").defaultTo("📈｜$count membres")
    table.string("onlineTrackerPattern").defaultTo("🟢｜$count connectés")
    table.string("messageTrackerPattern").defaultTo("📨｜$count messages")
  },
})
