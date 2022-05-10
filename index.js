const TelegramApi = require('node-telegram-bot-api')
const {gameOption, againOption} = require('./options')

const token = '5349577096:AAG_w3v2WS5n6DtAf_dg-NI439ZbjPaQTmI'
const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
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
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/0e3/159/0e315900-c335-352c-b746-124d5b940ac2/1.jpg')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот frontend разработчика Taras && Co`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
    })

    bot.on('callback_query', async msg => {

        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOption)
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOption)

        }
        // bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        // console.log(msg)
    })

}

startBot()