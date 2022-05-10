const TelegramApi = require('node-telegram-bot-api')
const {gameOption, againOption} = require('./options')

const token = '5349577096:AAG_w3v2WS5n6DtAf_dg-NI439ZbjPaQTmI'
const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/192/1.webp')

    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты будешь ее угадывать!')
    let randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOption)

}
const startBot = () => {
    bot.setMyCommands([
        {command: '/start', description:'Начальное приветствие'},
        {command: '/info', description:'Получить информацию о пользователе'},
        {command: '/game', description:'Игра угадай цифру'},
    ])
    bot.on('message', async msg => {
        console.log(msg);
        const text = msg.text;
        const chatId = msg.chat.id;
        // bot.sendMessage(chatId,`Ты написал мне ${text}` )
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/192/4.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот frontend разработчика Taras && Co`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        if (text.toLowerCase() === 'привет') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/43e/041/43e041ad-afbb-34c9-8e62-222f29474c0e/192/7.webp')
            return bot.sendMessage(chatId, `Здравствуйте я бот Тараса Шевченко, очень приятно познакомиться ${msg.from.first_name} ${msg.from.last_name}`)
        }

        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/192/7.webp')
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
    })

    bot.on('callback_query', async msg => {

        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/9df/619/9df6199a-ff6a-338d-9f74-625b0a647045/192/1.webp')
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOption)
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/192/19.webp')


            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOption)

        }
        // bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        // console.log(msg)
    })

}

startBot()