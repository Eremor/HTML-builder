const path = require('path');
const fs = require('fs/promises');

const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

const mergeStyles = async () => {
  const styles = [];
  const files = await fs.readdir(pathToStyles, {withFileTypes: true});
  let normalizeStyle = '';

  for(let file of files) {
    const ext = (file.name).split('.')[1]

    if(file.isFile() && ext === 'css') {
      const pathStyle = path.join(pathToStyles, file.name);
      const style = await fs.readFile(pathStyle)
      styles.push(style);
    }
  }

  await fs.rm(pathToBundle, {recursive: true, force: true});

  styles.forEach(style => normalizeStyle = normalizeStyle + style.toString() + '\n');

  await fs.writeFile(pathToBundle, normalizeStyle);
}

mergeStyles();