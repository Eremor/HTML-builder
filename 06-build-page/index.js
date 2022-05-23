const path = require('path');
const fs = require('fs/promises');

const pathToDist = path.join(__dirname, 'project-dist');
const pathToTemp = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToCopyFolder = path.join(__dirname, 'project-dist', 'assets');

const mergeStyles = async () => {
  const styles = [];
  const files = await fs.readdir(pathToStyles, {withFileTypes: true});
  let normalizeStyle = '';

  files.reverse();

  for(let file of files) {
    const ext = (file.name).split('.')[1]

    if(file.isFile() && ext === 'css') {
      const pathStyle = path.join(pathToStyles, file.name);
      const style = await fs.readFile(pathStyle);
      styles.push(style);
    }
  }

  styles.forEach(style => normalizeStyle = normalizeStyle + style.toString().trim() + '\n' + '\n');

  await fs.writeFile(`${pathToDist}/style.css`, normalizeStyle);
}

const copyFolder = async (src, dest) => {
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

const builder = async () => {
  await fs.rm(pathToDist, {recursive: true, force: true});
  await fs.mkdir(pathToDist);
  const tempFile = await fs.readFile(pathToTemp);
  const components = await fs.readdir(pathToComponents, { withFileTypes: true });

  let normalizeFile = '';
  let tempArr = tempFile.toString().split('\n');
  
  for(file of components) {
    const fileName = file.name.split('.')[0];
    const fileContent = await fs.readFile(`${pathToComponents}/${file.name}`);
    
    for(let i = 0; i < tempArr.length; i++) {
      if(tempArr[i].trim() == `{{${fileName}}}`) {
        let spaces = '';
        tempArr[i].split('').map((a) => a === ' ' ? spaces += a : '').join('');
        const markup = fileContent.toString().split('\n').map((a) => a = spaces + a).join('\n');
        tempArr.splice(i, 1, `${markup}\n`);
      }
    }
  }

  tempArr.forEach(line => normalizeFile += line);
  await fs.writeFile(`${pathToDist}/index.html`, normalizeFile);
  
  await mergeStyles();
  await copyFolder(pathToAssets, pathToCopyFolder);
}

builder();