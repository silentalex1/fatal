import { Client, Intents, MessageEmbed } from "discord.js"

let client = global.client

if (!client) {
  client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
  global.client = client

  global.keys = global.keys || {}
  global.activeKeys = global.activeKeys || {}

  function gen() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let r = ""
    for (let i = 0; i < 9; i++) r += chars[Math.floor(Math.random() * chars.length)]
    return "fatal_" + r
  }

  client.once("ready", () => {
    console.log("Bot ready")
  })

  client.on("messageCreate", async (msg) => {
    if (!msg.content.startsWith("$") || msg.author.bot) return

    const args = msg.content.slice(1).split(" ")
    const cmd = args.shift().toLowerCase()

    if (cmd === "createkey") {
      if (args.length < 2) return msg.channel.send("Usage: $createkey <name> <duration>")
      const name = args[0]
      const time = args[1]
      const key = gen()
      global.keys[key] = { name, time }
      const e = new MessageEmbed()
        .setTitle("Key Created").setColor("#ff1a1a")
        .addField("Key", `\`${key}\``)
        .addField("Assigned To", name, true)
        .addField("Duration", time, true)
      msg.channel.send({ embeds: [e] })
    }

    if (cmd === "keyverify") {
      const key = args[0]
      if (!global.keys[key]) {
        const e = new MessageEmbed().setTitle("Invalid Key").setColor("#8B0000").setDescription("Key not found.")
        return msg.channel.send({ embeds: [e] })
      }
      if (global.activeKeys[key]) {
        const e = new MessageEmbed().setTitle("Already Active").setColor("#FFA500").setDescription("Key already verified.")
        return msg.channel.send({ embeds: [e] })
      }
      global.activeKeys[key] = true
      const e = new MessageEmbed().setTitle("Key Verified").setColor("#32CD32").setDescription("Key activated.")
        .addField("Key", `\`${key}\``)
      msg.channel.send({ embeds: [e] })
    }

    if (cmd === "cmds") {
      const e = new MessageEmbed()
        .setTitle("Commands")
        .setColor("#1E90FF")
        .setDescription("`$createkey <name> <duration>` - Create key\n`$keyverify <key>` - Verify key\n`$cmds` - View commands")
      msg.channel.send({ embeds: [e] })
    }
  })

  client.login(process.env.DISCORD_BOT_TOKEN)
}

export default function handler(req, res) {
  res.status(200).send("Bot active")
}
