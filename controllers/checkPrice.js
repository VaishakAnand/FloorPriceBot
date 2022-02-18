const bot = require('../bot');
const priceCheckFn = require('../execution/checkPrice');
const getNormalTime = require('../util/datetime');

let plsStop = false;
let messageId = null;
let priceFloor = 1;
let chatId = process.env.CHAT_ID;
let count = 0;

const check = async () => {
    try {
        let price = await priceCheckFn();
        console.log("Price:", price);

        if (price == null) {
            count++;
        }
        if (count >= 2) {
            return;
        }

        let message = `\nRetrieval Time: ${getNormalTime()}\n\n`;

        message += `Floor Price: ${price}`;
        if (messageId == null && !plsStop) {
            await bot.telegram
                .sendMessage(chatId, message, {
                    parse_mode: 'HTML',
                })
                .then((messageDetails) => {
                    messageId = messageDetails.message_id;
                })
                .catch((err) => console.error(err));
        } else {
            await bot.telegram
                .editMessageText(
                    chatId,
                    messageId,
                    undefined,
                    message,
                    {
                        parse_mode: 'HTML',
                    }
                )
                .catch((err) => console.error(err));
        }

        if (price <= priceFloor && price != null) {
            let alertMessage = `<b>PRICE ALERT</b> @Vforvitagen\nFloor Price: ${price}`;

            await bot.telegram
                .sendMessage(chatId, alertMessage, {
                    parse_mode: 'HTML',
                })
                .catch((err) => console.error(err));
        }

        setImmediate(() => check());
    } catch (error) {
        console.error(error);
    }
};

bot.command('/stop', async () => {
    console.log('stopping');
    plsStop = true;
});

check();
