const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { FixFolderAndFile } = require("./utils");
const { CleanupFile } = require("./lib");
const path = require("path");
const fs = require("fs");
const { GetAllJsFiles, CheckIsJsFile } = require("./utils");

/**
 * 清理与修正nodejs打包生成生成的代码。
 */
function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      source: {
        alias: "s",
        type: "string",
        default: "./dist/source/app",
      },
      target: {
        alias: "t",
        type: "string",
        default: "./dist/target/app",
      },
      file: {
        alias: "f",
        type: "string",
        default: "",
      },
      target_file: {
        alias: "o",
        type: "string",
        default: "",
      },
    })
    .parseSync();

  let sourceFolder = path.resolve(argv.source);

  let targetFolder = path.resolve(argv.target);

  let sourceFile = path.resolve(argv.file);
  let targetFile = path.resolve(argv.target_file);

  FixFolderAndFile(
    sourceFolder,
    targetFolder,
    sourceFile,
    targetFile,
    fixCodes,
    fixFile
  );
}

function fixCodes(folder) {
  let files = GetAllJsFiles(folder);
  //rename first
  for (const file of files) {
    renameFile(file);
  }
  deleteEmptyFolders(folder);
  files = GetAllJsFiles(folder);
  for (const file of files) {
    CleanupFile(file);
  }
}
const deleteEmptyFolders = (dir) => {
  let files = fs.readdirSync(dir);
  if (files.length > 0) {
    files.forEach((file) => {
      let fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        deleteEmptyFolders(fullPath);
        if (fs.readdirSync(fullPath).length === 0) {
          fs.rmdirSync(fullPath);
        }
      }
    });
  }
};

function fixFile(fname) {
  if (!CheckIsJsFile(fname)) {
    console.log("Not js file");
    return;
  }
  CleanupFile(fname);
}

function renameFile(filename) {
  if (!filename.endsWith("index.js")) {
    return;
  }
  let res = path.resolve(filename);
  if (!fs.existsSync(res)) {
    return;
  }
  let newname = res.substring(0, res.indexOf(`${path.sep}index.js`)) + ".js";
  fs.renameSync(filename, newname);
}
main();
