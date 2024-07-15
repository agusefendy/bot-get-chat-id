const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [
      [{ text: "👤 User or 🤖 Bot", request_user: { request_id: 1 } }],
      [
        {
          text: "👥 Group",
          request_chat: {
            request_id: 3,
            chat_is_channel: false,
            chat_is_group: true,
          },
        },
        {
          text: "📢 Channel",
          request_chat: {
            request_id: 4,
            chat_is_channel: true,
            chat_is_group: false,
          },
        },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  const text = `Hello ${msg.from.first_name} ${
    msg.from.last_name ? `${msg.from.last_name} 🤠` : `🤠`
  } \nChoose chat type:`;
  bot.sendMessage(chatId, text, {
    reply_markup: keyboard,
  });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpText = `
      Available commands:
      /start - Start the bot
      /help - Display this help message
      /me - Get your chat ID`;

  bot.sendMessage(chatId, helpText);
});

bot.onText(/\/me/, (msg) => {
  const userId = msg.chat.id;

  bot.sendMessage(msg.chat.id, `🪪 Your chat ID is: <code>${userId}</code>`, {
    parse_mode: "HTML",
  });
});

bot.on("message", (msg) => {
  if (msg.user_shared) {
    const userId = msg.user_shared.user_id;
    bot.sendMessage(msg.chat.id, `🪪 The chat ID is: <code>${userId}</code>`, {
      parse_mode: "HTML",
    });
  } else if (msg.chat_shared) {
    const chatId = msg.chat_shared.chat_id;
    const requestId = msg.chat_shared.request_id;
    let type = "";

    switch (requestId) {
      case 2:
        type = "Bot";
        break;
      case 3:
        type = "Group";
        break;
      case 4:
        type = "Channel";
        break;
    }

    bot.sendMessage(
      msg.chat.id,
      `🪪 The ID of the ${type} is: <code>${chatId}</code>`,
      { parse_mode: "HTML" }
    );
  }
});
