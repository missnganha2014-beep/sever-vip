const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = process.env.7933425025:AAEd_LL_Q0TbkLFiXOH7esPurn8ID7fSpm0;

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Bot started...");

// ================= DATA =================

const keys = {};

/*
keys[key] = {
  expireAt: timestamp | null,
  disabled: false
}
*/

// ================= UTIL =================

function generateKey() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function getExpire(type) {
  const now = Date.now();

  if (type === "week") return now + 7 * 24 * 60 * 60 * 1000;
  if (type === "month") return now + 30 * 24 * 60 * 60 * 1000;
  if (type === "permanent") return null;

  return null;
}

function isExpired(keyData) {
  if (keyData.expireAt === null) return false;
  return Date.now() > keyData.expireAt;
}

// ================= TẠO KEY =================

bot.onText(/\/week/, (msg) => {
  const key = generateKey();

  keys[key] = {
    expireAt: getExpire("week"),
    disabled: false
  };

  bot.sendMessage(msg.chat.id, "🔑 KEY 1 TUẦN:\n\n" + key);
});

bot.onText(/\/month/, (msg) => {
  const key = generateKey();

  keys[key] = {
    expireAt: getExpire("month"),
    disabled: false
  };

  bot.sendMessage(msg.chat.id, "🔑 KEY 1 THÁNG:\n\n" + key);
});

bot.onText(/\/permanent/, (msg) => {
  const key = generateKey();

  keys[key] = {
    expireAt: null,
    disabled: false
  };

  bot.sendMessage(msg.chat.id, "👑 KEY VĨNH VIỄN:\n\n" + key);
});

// ================= NGẮT KEY =================
// /disable ABC123

bot.onText(/\/disable (.+)/, (msg, match) => {
  const key = match[1];

  if (!keys[key]) {
    return bot.sendMessage(msg.chat.id, "❌ Key không tồn tại.");
  }

  keys[key].disabled = true;

  bot.sendMessage(msg.chat.id, "🚫 Đã ngắt key " + key);
});

// ================= CHECK KEY =================
// /key ABC123

bot.onText(/\/key (.+)/, (msg, match) => {
  const key = match[1];
  const keyData = keys[key];

  if (!keyData) {
    return bot.sendMessage(msg.chat.id, "❌ Key không tồn tại.");
  }

  if (keyData.disabled) {
    return bot.sendMessage(msg.chat.id, "🚫 Key đã bị ngắt.");
  }

  if (isExpired(keyData)) {
    return bot.sendMessage(msg.chat.id, "❌ Key đã hết hạn.");
  }

  bot.sendMessage(msg.chat.id, "✅ Key hợp lệ!");
});

// ================= START =================

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Bot Key 🔥\n\nTạo key:\n/week\n/month\n/permanent\n\nCheck key:\n/key ABC123\n\nNgắt key:\n/disable ABC123"
  );
});

app.get("/", (req, res) => {
  res.send("Bot running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});