const path = require('path');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const sourceDirectory = process.argv[2];
const targetDirectory = process.argv[3];
const shouldDelete = process.argv[4];

if (!sourceDirectory || !targetDirectory) {
  return console.log('Please specify both initial and target directories');
}

const copyFile = (file, filePath) => {
  const firstLetter = file.charAt(0).toUpperCase();
  const newFilePath = path.join(__dirname, targetDirectory, firstLetter, file);
  const newFolderPath = path.join(__dirname, targetDirectory, firstLetter);
  const targetDirectoryPath = path.join(__dirname, targetDirectory);

  if (!fs.existsSync(targetDirectoryPath)){
    fs.mkdirSync(targetDirectoryPath);
  };

  if (!fs.existsSync(newFolderPath)){
    fs.mkdirSync(newFolderPath);
  };

  fs.copyFile(filePath, newFilePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

// async/await vaersion

const checkIsDirectory = async (currentPath) => {
  const stats = await stat(currentPath);

  return stats;
};

const sortFiles = async (directory) => {
  try {
    const files = await readdir(directory);

    files.forEach(async (file) => {
      if(/^\..*/.test(file)) {
        return;
      };

      const currentPath = path.join(__dirname, directory, file);
      const stats = await checkIsDirectory(currentPath);

      return stats.isFile() 
        ? copyFile(file, currentPath) 
        : sortFiles(path.join(directory, file));
    })
  } catch (error) {
    console.log(error);
  }
};
  
// Callbacks version

// fs.readdir(directory, (err, files) => {
//   if (err)
//     console.log(err);
//   else {
//     files.forEach(file => {
//       if(! /^\..*/.test(file)) {
//         const currentPath = path.join(__dirname, directory, file);
//         fs.stat(currentPath, (err, stats) => {
//           if (err)
//             console.log(err);
//           else {
//             if (stats.isFile()) {
//               copyFile(file, currentPath)
//             } else {
//               sortFiles(path.join(directory, file));
//             }
//           }
//         });
//       }
//     })
//   }
// });

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