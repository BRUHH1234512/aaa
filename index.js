const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();
const port = 3000;

const BOT_USERNAME = 'BotMinecraft';                 // Bot's name
const SERVER_HOST = 'SIGMA13242.aternos.me';            // Server address
const SERVER_PORT = 50171;                           // Server port
const LOGIN_PASSWORD = 'Botpassword';                // Password used for /register and /login

let behaviorIntervals = []; 

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: false,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log(`${bot.username} has joined the game.`);
    const delay = getRandomInt(5000, 7000);
    setTimeout(() => {
      bot.chat(`/register ${LOGIN_PASSWORD} ${LOGIN_PASSWORD}`);
      setTimeout(() => {
        bot.chat(`/login ${LOGIN_PASSWORD}`);
      }, 1000);
    }, delay);

    startRandomBehavior(bot);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err.message);
  });

  bot.on('end', () => {
    console.log(`${bot.username} has left. Respawning in a few seconds...`);


    behaviorIntervals.forEach(clearInterval);
    behaviorIntervals = [];

    const respawnDelay = getRandomInt(5000, 7000);
    setTimeout(createBot, respawnDelay);
  });

  return bot;
}

function startRandomBehavior(bot) {

  const lookInterval = setInterval(() => {
    const dx = (Math.random() - 0.5) * 0.4;
    const dz = (Math.random() - 0.5) * 0.4;
    const yaw = bot.entity.yaw + dx;
    const pitch = bot.entity.pitch + dz;
    bot.look(yaw, pitch, true);
  }, 5000);
  behaviorIntervals.push(lookInterval);


  const sneakInterval = setInterval(() => {
    bot.setControlState('sneak', true);
    setTimeout(() => bot.setControlState('sneak', false), getRandomInt(500, 2000));
  }, getRandomInt(60000, 120000));
  behaviorIntervals.push(sneakInterval);


  const clickInterval = setInterval(() => {
    const clickType = Math.random() < 0.5 ? 'left' : 'right';
    if (clickType === 'left') {
      bot.swingArm('right');
    } else {
      bot.activateItem();
    }
  }, getRandomInt(60000, 120000));
  behaviorIntervals.push(clickInterval);

 
  const moveInterval = setInterval(() => {
    const directions = ['forward', 'back', 'left', 'right'];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    bot.setControlState(dir, true);
    setTimeout(() => bot.setControlState(dir, false), getRandomInt(300, 700));
  }, getRandomInt(15 * 60 * 1000, 20 * 60 * 1000));
  behaviorIntervals.push(moveInterval);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => res.send('Bot online!'));
app.listen(port, () => console.log(`Uptime server is open at http://localhost:${port}`));

createBot();
