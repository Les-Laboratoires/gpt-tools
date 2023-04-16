import { Table } from "@ghom/orm"

export interface GuildTable {
  id: string
  prefix: string
  messageCount: number
  arriveMessageChannel: string | null
  leaveMessageChannel: string | null
  userArriveMessage: string
  botArriveMessage: string
  userLeaveMessage: string
  botLeaveMessage: string
  userDefaultRole: string | null
  botDefaultRole: string | null
  trackerCategory: string | null
  memberTrackerPattern: string
  onlineTrackerPattern: string
  messageTrackerPattern: string
  lastMemberCount: number
  lastOnlineCount: number
  lastMessageCount: number
}

export default new Table<GuildTable>({
  name: "guilds",
  setup: (table) => {
    table.string("id").primary()
    table.string("prefix").defaultTo("!")
    table.integer("messageCount").defaultTo(0)
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
    table.integer("lastMemberCount").defaultTo(0)
    table.integer("lastOnlineCount").defaultTo(0)
    table.integer("lastMessageCount").defaultTo(0)
  },
})
