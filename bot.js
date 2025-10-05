const { Telegraf } = require('telegraf');

const BOT_TOKEN = '7871705211:AAEXrHzaRsYUoxB2_yRk7VxmU_FQRuPBDuE';
const WEB_APP_URL = 'https://sigmacoder122.github.io/my-gifts-app'; // ссылка на React App

const bot = new Telegraf(BOT_TOKEN);

// Команда /start
bot.start((ctx) => {
    ctx.reply(
        'Привет! Открой маркет:',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Открыть Маркет",
                            web_app: { url: WEB_APP_URL }
                        }
                    ]
                ]
            }
        }
    );
});

bot.launch();

console.log('Бот запущен');
