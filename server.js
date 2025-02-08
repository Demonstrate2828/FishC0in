const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');

const BOT_TOKEN = "7844863556:AAEgPiC8_QDPmQYffnJdXT1aNbOFpa_9Ffo"; // Вставь свой токен
const WEB_APP_URL = "https://fishcoin.vercel.app"; // Ссылка на WebApp
const TON_WALLET = "UQBO_91X8EcQF_RQqFUYIu308ZBlwjuhwWrsvOAKh2CMbD4S"; // Адрес TON-кошелька для платежей

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Данные о цене и инвесторах
let priceHistory = [1, 1.2, 1.5, 1.3, 1.8, 2.0];
let topInvestors = [];

// Команда /start для бота
bot.start((ctx) => {
    ctx.reply("Добро пожаловать в FishCoin! 🐟💰\nИнвестируй в валюту и следи за курсом!", {
        reply_markup: {
            inline_keyboard: [[{ text: "📊 Открыть WebApp", web_app: { url: WEB_APP_URL } }]]
        }
    });
});

// API для WebApp
app.get('/price-history', (req, res) => res.json(priceHistory));
app.get('/top-investors', (req, res) => res.json(topInvestors));

app.post('/pay', (req, res) => {
    const { userId, amount } = req.body;
    const paymentUrl = `https://ton.org/pay?amount=${amount}&currency=TON&to=${TON_WALLET}`;
    
    topInvestors.push({ userId, amount });
    res.json({ paymentUrl });
});

// Запуск бота
bot.launch();
console.log("🤖 Бот запущен!");

// Запуск сервера
app.listen(5000, () => console.log("🌍 Сервер запущен на порту 5000"));
