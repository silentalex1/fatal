export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const key = req.body.key
  global.keys = global.keys || {}
  if (global.keys[key]) return res.json({ status: "success" })
  res.json({ status: "error" })
}

