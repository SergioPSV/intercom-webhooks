const TelegramBot = require('node-telegram-bot-api');
const Koa = require('koa');
const Router = require('koa-router');
const Parser = require('koa-bodyparser');

const token = 'telegram-token';
const url = 'where_send_webhooks(url)';
const id_team = 'id_telegram_chat';

const bot = new TelegramBot(token);
const app = new Koa();

bot.setWebHook(`${url}/${token}`);

const router = Router();
router.post('/', ctx => {
    const { body } = ctx.request;
    ctx.status = 200;

    let rating, typeCustomer, customerId, web, ratingSmile, adminName, clientComment;
    let final = body.topic + '😁';      // for PING webhooks

    if (body.data.item.conversation_rating) {
        rating = body.data.item.conversation_rating.rating;
        clientComment = body.data.item.conversation_rating.remark;

            if (rating == 1) {
                ratingSmile = '😠 — Terrible';
            } else if (rating == 2) {
                ratingSmile = '🙁 — Bad';
            } else if (rating == 3) {
                ratingSmile = '😐 — OK';
            } else if (rating >= 4 && clientComment != null) {
                ratingSmile = '🥳';
            } else {
                return;
            }

        web = body.data.item.links.conversation_web;
        adminName = body.data.item.assignee.name;
        typeCustomer = body.data.item.conversation_rating.customer.type;

            if (typeCustomer == 'user') {
                customerId = body.data.item.conversation_rating.customer.id;
                customerId = customerId.replace(/(.joinposter.com)/g, '');
            } else {
                customerId = 'Lead';
            }
            if (clientComment != null) {
                final = `*${customerId}* написал нам: ${clientComment}\n\n[Прочитать чат](${web})`;
            } else {
                final = `*${customerId}* поставил нам ${ratingSmile}. Менеджер: *${adminName}*.\n\n👉[Проработать оценку](${web})👈 \n\nLet’s do it!`;
            }

    }

    bot.sendMessage(id_team, final, { parse_mode: 'Markdown' });
});

app.use(Parser());
app.use(router.routes());

const port = 3000;
const host = 'localhost';
app.listen(port, host, () => {
    console.log(`Listening on ${port}`)
});
