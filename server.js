require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Telegraf } = require("telegraf");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    userId: Number,
    balance: Number,
    investments: [{ amount: Number, timestamp: Date }],
});

const User = mongoose.model("User", UserSchema);

// Получение истории цен (заглушка, заменишь на реальный источник)
let priceHistory = Array.from({ length: 20 }, () => ({
    time: new Date(),
    price: Math.random() * 100,
}));

app.get("/price-history", (req, res) => res.json(priceHistory));

app.post("/invest", async (req, res) => {
    const { userId, amount } = req.body;

    let user = await User.findOne({ userId });
    if (!user) {
        user = new User({ userId, balance: 0, investments: [] });
    }

    user.investments.push({ amount, timestamp: new Date() });
    await user.save();

    res.json({ success: true });
});

// Получение топ инвесторов
app.get("/top-investors", async (req, res) => {
    const topInvestors = await User.find()
        .sort({ "investments.amount
