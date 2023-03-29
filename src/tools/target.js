const fs = require("fs");
const path = require("node:path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { FixFolderAndFile, GetAllJsFiles, CheckIsJsFile } = require("./utils");
/**
 * 简单处理js文件
 * @param filename 文件名
 */
function processComment(filename) {
  if (!fs.existsSync(filename)) {
    return;
  }
  const content = fs.readFileSync(filename, "utf8");

  let data = content;
  const regex = /const[\s\S]*require\("yao-node-client"\)[;]?[\r\n]?[\r\n]?/gi;
  data = data.replace(regex, "");

  // /module\.exports[^]*[;]\n[\n]?/gi
  const regex2 = /module\.exports[\s\S]*}[;]?[\r\n]?[\r\n]?/gi;
  data = data.replace(regex2, "");

  const regex3 = /exports\.[\s\S]*[;]?[\r\n]?[\r\n]?/gi;

  data = data.replace(regex3, "");
  if (content != data) {
    fs.writeFileSync(filename, data);
    console.log(`File ${filename} updated and saved!`);
  }
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
function fixCodes(folder) {
  let files = GetAllJsFiles(folder);
  //rename first
  for (const file of files) {
    renameFile(file);
  }
  deleteEmptyFolders(folder);
  files = GetAllJsFiles(folder);
  for (const file of files) {
    processComment(file);
  }
}
function fixFile(fname) {
  if (!CheckIsJsFile(fname)) {
    console.log("Not js file");
    return;
  }
  processComment(fname);
}
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
    })
    .parseSync();

  let sourceFolder = path.resolve(argv.source);

  let targetFolder = path.resolve(argv.target);

  let sourceFile = path.resolve(argv.file);

  FixFolderAndFile(sourceFolder, targetFolder, sourceFile, fixCodes, fixFile);
}

main();

function test() {
  const text = `
  // yao studio run init.CreateTableAndForm supplier
  
  
  module.exports = { MakeDefaultTable, MakeDefaultForm, CreateTable, CreateForm, deleteObjectKey, test_delete_object_key, CreateTableAndForm };`;
  let text2 = text.replace(/module\.exports[\s\S]*}[;]?[\r\n]?[\r\n]?/gi, "");
  console.log(text2);
}

// test();
