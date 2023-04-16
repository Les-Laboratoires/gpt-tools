import discord from "discord.js"

export function buildMessage(
  message: string,
  member: discord.GuildMember | discord.PartialGuildMember
) {
  return message
    .replace(/\$user/g, member.user.toString())
    .replace(/\$username/g, member.user.username)
    .replace(/\$mention/g, member.toString())
    .replace(/\$guild/g, member.guild.name)
    .replace(/\$memberCount/g, member.guild.memberCount.toString())
    .replace(/\$displayName/g, member.displayName)
    .replace(/\$tag/g, member.user.tag)
    .replace(/\$id/g, member.user.id)
    .replace(/\$avatar/g, member.user.displayAvatarURL())
    .replace(/\$createdAt/g, member.user.createdAt.toUTCString())
}
