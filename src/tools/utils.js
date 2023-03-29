const fs = require("fs");
const path = require("node:path");

function FixFolderAndFile(
  sourceFolder,
  targetFolder,
  sourceFile,
  fixFolderCb,
  fixFileCb
) {
  if (sourceFolder === "" && sourceFile === "") {
    throw new Error("请指定源目录或文件");
  }

  if (targetFolder === sourceFolder) {
    console.log("same folder abort!!");
    return;
  }

  if (fs.existsSync(sourceFile) && !fs.statSync(sourceFile).isDirectory()) {
    let targetFile = path.join(targetFolder, path.basename(sourceFile));
    fs.copyFileSync(sourceFile, targetFile);
    fixFileCb(targetFile);
    return;
  }

  CopyFolder(
    path.join(sourceFolder, "scripts"),
    path.join(targetFolder, "scripts")
  );
  CopyFolder(
    path.join(sourceFolder, "services"),
    path.join(targetFolder, "services")
  );
  CopyFolder(
    path.join(sourceFolder, "studio"),
    path.join(targetFolder, "studio")
  );

  if (fs.existsSync(targetFolder)) {
    fixFolderCb(targetFolder);
  } else {
    console.log(`directory not exist ${targetFolder}`);
  }
}

const CopyFolder = (source, destination) => {
  if (!fs.existsSync(source)) {
    return;
  }
  if (fs.existsSync(destination)) {
    fs.rmSync(destination, { recursive: true, force: true });
  }
  try {
    fs.mkdirSync(destination, { recursive: true });
    fs.readdirSync(source).forEach((file) => {
      const currentPath = `${source}/${file}`;
      const newPath = `${destination}/${file}`;
      if (fs.statSync(currentPath).isDirectory()) {
        CopyFolder(currentPath, newPath);
      } else {
        fs.copyFileSync(currentPath, newPath);
      }
    });
    console.log(`Successfully copied ${source} to ${destination}`);
  } catch (error) {
    console.error(
      `Error copying ${source} to ${destination}: ${error.message}`
    );
    return false;
  }
  return true;
};

function CheckIsJsFile(filePath) {
  const ext = path.extname(filePath);
  return ext === ".js";
}
/**
 * 读取一个目录下所有的js文件
 * @param dir 目录
 * @returns
 */
function GetAllJsFiles(dir) {
  let filesall = [];
  let getFile = (d) => {
    const files = fs.readdirSync(d);
    files.forEach(function (file) {
      const filePath = d + "/" + file;
      const fileStat = fs.lstatSync(filePath);
      if (fileStat.isDirectory()) {
        getFile(filePath);
      } else {
        if (CheckIsJsFile(filePath)) {
          filesall.push(filePath);
        }
      }
    });
  };
  getFile(dir);
  return filesall;
}

module.exports = {
  CopyFolder,
  FixFolderAndFile,
  GetAllJsFiles,
  CheckIsJsFile,
};
