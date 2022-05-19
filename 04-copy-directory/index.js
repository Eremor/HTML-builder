const path = require('path');
const fs = require('fs/promises');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

const copyFolder = async (src, dest) => {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true })

  const files = await fs.readdir(src, {withFileTypes: true});

  files.forEach(async (file) => {
    const lastPath = path.join(src, file.name);
    const newPath = path.join(dest, file.name);

    if(file.isDirectory()) {
      await copyFolder(lastPath, newPath);
    } else {
      await fs.copyFile(lastPath, newPath);
    }
  })
}

copyFolder(pathToFolder, pathToCopyFolder)
