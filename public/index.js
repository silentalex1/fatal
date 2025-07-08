const msg = document.getElementById("msg")
const btn = document.getElementById("verifyBtn")
const input = document.getElementById("keyInput")

btn.addEventListener("click", () => {
const key = input.value.trim()
if (!key) {
    msg.style.color = "#ff3b3b"
    msg.textContent = "Enter a key."
    return
}
fetch("/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key })
})
.then(res => res.json())
.then(data => {
    if (data.status === "success") {
    msg.style.color = "#7fff7f"
    msg.textContent = "Access granted."
    } else {
    msg.style.color = "#ff3b3b"
    msg.textContent = "Invalid key."
    }
})
.catch(() => {
    msg.style.color = "#ff3b3b"
    msg.textContent = "Unable to connect."
})
})

input.addEventListener("keydown", e => {
if (e.key === "Enter") btn.click()
})