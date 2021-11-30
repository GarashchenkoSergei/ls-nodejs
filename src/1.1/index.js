const path = require('path');
const fs = require('fs');

const sourceDirectory = process.argv[2];
const targetDirectory = process.argv[3];
const shouldDelete = process.argv[4];

if (!sourceDirectory || !targetDirectory) {
  return console.log('Please specify both initial and target directories');
}

// взять папку, переработать файлы, если папка, то рекурсия
// на каждую функцию сделать папку

const copyFile = (file, filePath) => {
  const firstLetter = file.charAt(0).toLowerCase();
  const newFilePath = path.join(__dirname, targetDirectory, firstLetter, file);
  const newFolderPath = path.join(__dirname, targetDirectory, firstLetter);
  const targetDirectoryPath = path.join(__dirname, targetDirectory);

  if (!fs.existsSync(targetDirectoryPath)){
    fs.mkdirSync(targetDirectoryPath);
  };

  if (!fs.existsSync(newFolderPath)){
    fs.mkdirSync(newFolderPath);
  };

  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const sortFiles = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if(! /^\..*/.test(file)) {
          const currentPath = path.join(__dirname, directory, file);
          fs.stat(currentPath, (err, stats) => {
            if (err)
              console.log(err);
            else {
              if (stats.isFile()) {
                copyFile(file, currentPath)
              } else {
                sortFiles(path.join(directory, file));
              }
            }
          });
        }
      })
    }
  });
};

sortFiles(sourceDirectory);

if (shouldDelete) {
  const sourseFolder = path.join(__dirname, sourceDirectory);

  fs.rmdir(sourseFolder, { recursive: true }, (err) => {
    if (err) {
        throw err;
    }

    console.log(`${sourseFolder} is deleted!`);
});
}