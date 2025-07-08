const express = require("express")
const cors = require("cors")
const path = require("path")
const { Client, Intents, MessageEmbed } = require("discord.js")

const app = express()
app.use(cors())
app.use(express.json())

const keys = {}
const activeKeys = {}

function generateKey() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let res = ""
  for (let i = 0; i < 9; i++) res += chars.charAt(Math.floor(Math.random() * chars.length))
  return "fatal_" + res
}

app.post("/verify", (req, res) => {
  const { key } = req.body
  if (keys[key]) return res.json({ status: "success" })
  res.json({ status: "error" })
})

app.post("/create", (req, res) => {
  const { name, time } = req.body
  const newKey = generateKey()
  keys[newKey] = { name, time }
  res.json({ key: newKey })
})

app.use(express.static(path.join(__dirname, "public")))

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.once("ready", () => {
  console.log("Bot ready")
})

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("$") || message.author.bot) return

  const args = message.content.slice(1).trim().split(/ +/)
  const cmd = args.shift().toLowerCase()

  if (cmd === "createkey") {
    if (args.length < 2) return message.channel.send("Usage: $createkey <name> <duration>")
    const name = args[0]
    const duration = args[1]
    const newKey = generateKey()
    keys[newKey] = { name, time: duration }
    const embed = new MessageEmbed()
      .setTitle("Key Created")
      .setColor("#ff1a1a")
      .addField("Key", `\`${newKey}\``)
      .addField("Assigned To", name, true)
      .addField("Duration", duration, true)
    message.channel.send({ embeds: [embed] })
  }

  if (cmd === "keyverify") {
    if (args.length < 1) return message.channel.send("Usage: $keyverify <key>")
    const key = args[0]
    if (!keys[key]) {
      return message.channel.send({
        embeds: [new MessageEmbed().setTitle("Invalid Key").setColor("#8B0000").setDescription("Key not found.")]
      })
    }
    if (activeKeys[key]) {
      return message.channel.send({
        embeds: [new MessageEmbed().setTitle("Already Active").setColor("#FFA500").setDescription("Key already verified.")]
      })
    }
    activeKeys[key] = true
    message.channel.send({
      embeds: [new MessageEmbed().setTitle("Key Verified").setColor("#32CD32").setDescription("Key activated.").addField("Key", `\`${key}\``)]
    })
  }

  if (cmd === "cmds") {
    message.channel.send({
      embeds: [new MessageEmbed()
        .setTitle("Commands")
        .setColor("#1E90FF")
        .setDescription(
          "`$createkey <name> <duration>` - Generate a new key\n" +
          "`$keyverify <key>` - Verify a key\n" +
          "`$cmds` - List commands"
        )]
    })
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)

const PORT = process.env.PORT || 3000
app.listen(PORT)
