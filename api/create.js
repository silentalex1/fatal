export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { name, time } = req.body
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let gen = ""
  for (let i = 0; i < 9; i++) gen += chars[Math.floor(Math.random() * chars.length)]
  const key = "fatal_" + gen

  global.keys = global.keys || {}
  global.keys[key] = { name, time }

  res.json({ key })
}
