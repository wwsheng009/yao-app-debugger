const fs = require("fs");
const path = require("node:path");

function FixFolder(sourceFolder, targetFolder, fixFolderCb) {
  console.log(`源目录：${sourceFolder},目标目录:${targetFolder}`)
  if (sourceFolder === "") {
    console.log("请指定源目录！");
    return;
  }
  if (targetFolder === "") {
    console.log("请指定目标目录！");
    return;
  }
  if (targetFolder === sourceFolder) {
    console.log("源目录与目标目录一样！");
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
function FixFile(sourceFile, targetFile, fixFileCb) {
  console.log(`源文件${sourceFile},目标文件:${targetFile}`)

  if (sourceFile === "") {
    console.log("请指定源文件！");
    return;
  }
  if (targetFile === "") {
    console.log("请指定目标文件！");
    return;
  }
  if (sourceFile !== "" && sourceFile === targetFile) {
    console.log(`源文件与目标文件一样！${sourceFile}`);
    return;
  }

  if (fs.existsSync(sourceFile) && !fs.statSync(sourceFile).isDirectory()) {
    // let targetFile = path.join(targetFolder, path.basename(sourceFile));
    const folderPath = path.dirname(targetFile);
    fs.mkdirSync(folderPath, { recursive: true });
    fs.copyFileSync(sourceFile, targetFile);
    fixFileCb(targetFile);
    return;
  }
}

function FixFolderAndFile(
  sourceFolder,
  targetFolder,
  sourceFile,
  targetFile,
  fixFolderCb,
  fixFileCb
) {
  if (sourceFile !== "" && targetFile !== "") {
    FixFile(sourceFile, targetFile, fixFileCb);
  } else {
    console.log("文件路径为空，不复制");
  }
  if (sourceFolder !== "" && targetFolder !== "") {
    FixFolder(sourceFolder, targetFolder, fixFolderCb);
  } else {
    console.log("目录路径为空，不复制");
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
  FixFile,
  FixFolder,
  GetAllJsFiles,
  CheckIsJsFile,
};
