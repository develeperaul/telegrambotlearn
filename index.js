const TelegramBot = require('node-telegram-bot-api')
const {gameOptions,againOptions} = require('./options.js')
const token = '5273323189:AAGaBQ4KfewN7CkdbeXq5ivo4a0OBMCxbxI'

const bot = new TelegramBot(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, попробуйте отгадать')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывайте', gameOptions)
}

const start = () =>{
    bot.setMyCommands([
        {command: '/start',description: 'Начальное приветствие'},
        {command: '/info',description: 'Получить онформацию'},
        {command: '/game',description: 'Игра угадай число'}
    ])
    
    bot.on('message', async msg=>{
        const text = msg.text
        const chatId = msg.chat.id
        //отправляем сообщение
        
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b08/942/b08942f6-9ad5-38ca-99b6-8e79908886fd/3.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать')
        }
        if(text === '/info')return  bot.sendMessage(chatId, `Вас зовут ${msg.from.last_name} ${msg.from.first_name}`)
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я вас не понимаю, попробуйте еще раз 0')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        console.log(data )
        console.log(chats[chatId] )
        if(data == chats[chatId])return bot.sendMessage(chatId, `Поздравляю вы отгадали число ${chats[chatId]}`, againOptions)
        
        else return  bot.sendMessage(chatId, `К сожалению вы не отгадали, бот загадал цифру ${chats[chatId]}`, againOptions)
        
        // console.log(msg)
    })
}

start()