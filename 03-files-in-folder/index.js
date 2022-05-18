const process = require('process');
const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'secret-folder');

const showFilesStat = (err, files) => {
  if(err) process.stderr.write(err);
  
  for(let file of files) {
    if(file.isFile()) {
      fs.stat(`${pathToFolder}/${file.name}`, (err, stats) => getFileStat(err, stats, file.name))
    }
  }
}

const getFileStat = (err, stats, fileName) => {
  if(err) process.stderr.write(err);

  const fileArr = fileName.split('.');
  const size = (stats.size / 1024).toFixed(2);

  process.stdout.write(`${fileArr[0]} - ${fileArr[1]} - ${size}kb\n`);
}

fs.readdir(pathToFolder, {withFileTypes: true}, showFilesStat);

