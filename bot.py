import os
import logging
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, MenuButtonWebApp
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.environ["BOT_TOKEN"]
WEBAPP_URL = os.environ["WEBAPP_URL"]


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    keyboard = [[
        InlineKeyboardButton(
            "🎴 Открыть Torpedo Cards",
            web_app=WebAppInfo(url=WEBAPP_URL),
        )
    ]]
    await update.message.reply_text(
        "Привет! Нажми кнопку, чтобы открыть коллекцию карточек ХК Торпедо 🏒",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )


async def post_init(app: Application) -> None:
    await app.bot.set_my_commands([("start", "Открыть Torpedo Cards")])
    await app.bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(text="🎴 Карточки", web_app=WebAppInfo(url=WEBAPP_URL))
    )
    logger.info("Menu button set to %s", WEBAPP_URL)


def main() -> None:
    app = (
        Application.builder()
        .token(BOT_TOKEN)
        .post_init(post_init)
        .build()
    )
    app.add_handler(CommandHandler("start", start))
    logger.info("Bot started")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
