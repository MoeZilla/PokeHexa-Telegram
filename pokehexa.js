const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const moment = require('moment');
const fs = require('fs');
const fse = require('fs-extra');

var GameBoyAdvance = require('gbajs');
 
var gba = new GameBoyAdvance();
 
gba.logLevel = gba.LOG_ERROR;
 
var biosBuf = fs.readFileSync('./node_modules/gbajs/resources/bios.bin');
gba.setBios(biosBuf);
gba.setCanvasMemory();
 
gba.loadRomFromFile('./hexa.gba', function (err, result) {
  if (err) {
    console.error('loadRom failed:', err);
    process.exit(1);
  }
  gba.loadSavedataFromFile('./hexa.sav');
  gba.runStable();
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Bot started! Type /help to see the available commands.');
});

bot.command('help', (ctx) => {
  const helpMessage = `
    Welcome to the botname
    
    **Controls**
    /a - Presses A
    /b - Presses B
    /l - Presses R
    /r - Presses L
    /starts - Presses START
    /select - Presses SELECT
    /up - Presses UP
    /down - Presses DOWN
    /left - Presses LEFT
    /right - Presses RIGHT
    /screen - Shows the current screen
    /help - Shows this help message
  `;
  ctx.reply(helpMessage);
});



bot.command(['a', 'b', 'l', 'r', 'start', 'select', 'up', 'down', 'left', 'right'], (ctx) => {
  var keypad = gba.keypad
  var idx = 0;
  const command = ctx.message.text.substr(1); // Remove the leading slash
  // Process the command and update the screen
  switch (command) {
      case 'a':
          keypad.press(keypad.A)
          updateScreen(0, ctx, true);
        break;
      case 'b':
          keypad.press(keypad.B)
          updateScreen(0, ctx, true);
        break;
      case 'l':
          keypad.press(keypad.L)
          updateScreen(0, ctx, true);
        break;
      case 'r':
          keypad.press(keypad.R)
          updateScreen(0, ctx, true);
        break;
      case 'up':
          keypad.press(keypad.UP)
          updateScreen(0, ctx, true);
        break;
      case 'down':
          keypad.press(keypad.DOWN)
          updateScreen(0, ctx, true);
        break;
      case 'left':
          keypad.press(keypad.LEFT)
          updateScreen(0, ctx, true);
        break;
      case 'right':
          keypad.press(keypad.right)
          updateScreen(0, ctx, true);
        break;
      case 'select':
          keypad.press(keypad.SELECT)
          updateScreen(0, ctx, true);
        break;
      case 'starts':
          keypad.press(keypad.START)
          updateScreen(0, ctx, true);
        break;
      case 'right':
          keypad.press(keypad.right)
          updateScreen(0, ctx, true);
        break;
        default:
          console.log(`Incorrect input: ${command}`);
        break;
      }
      
});

bot.command('screen', (ctx) => {
  updateScreen(0, ctx, false);
});

function updateScreen(idx, ctx, d) {
  var delay = 500;
  if (d) {
    delay = 1250;
  }
  setTimeout(() => {
    var png = gba.screenshot();
    png.pack().pipe(fs.createWriteStream('gba' + idx + '.png'));
    setTimeout(() => {
      ctx.replyWithPhoto({ source: './gba0.png' }, { caption: 'Current Screen' });
    }, 250);
  }, delay);
}

bot.launch();
