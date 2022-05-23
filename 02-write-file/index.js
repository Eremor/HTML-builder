const process = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pathToFile = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(pathToFile);

process.stdout.write('Please enter text:\n');

const rl = readline.createInterface({ input: process.stdin });

const exitConsole = () => {
  process.stdout.write('Bye! Have a nice day');
  process.exit(0);
}

rl.on('line', (line) => {
  if(line.trim() === 'exit') {
    exitConsole();
  } else {
    writeStream.write(`${line}\n`);
  }
})

process.on('SIGINT', () => {
  exitConsole();
})