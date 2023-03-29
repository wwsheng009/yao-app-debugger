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
  const fileContent = fs.readFileSync(filename, "utf8");
  // Define the regular expression to match function names
  const regex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/g;

  // Find all matches
  let match;
  const functionNames = [];
  while ((match = regex.exec(fileContent)) !== null) {
    functionNames.push(match[1]);
  }

  let words = [];
  if (/\slog\./.exec(fileContent) !== null) {
    words.push("log");
  }
  if (/\shttp\./.exec(fileContent) !== null) {
    words.push("http");
  }
  if (/\snew\s*Store\(/.exec(fileContent) !== null) {
    words.push("Store");
  }
  if (/\snew\s*Exception\(/.exec(fileContent) !== null) {
    words.push("Exception");
  }
  if (/\snew\s*FS\(/.exec(fileContent) !== null) {
    words.push("FS");
  }
  if (/\snew\s*WebSocket\(/.exec(fileContent) !== null) {
    words.push("WebSocket");
  }
  if (/\snew\s*Query\(/.exec(fileContent) !== null) {
    words.push("Query");
  }
  if (/\sProcess\(/.exec(fileContent) !== null) {
    words.push("Process");
  }
  if (/\sStudio\(/.exec(fileContent) !== null) {
    words.push("Studio");
  }

  let data = [];
  let header = "";
  if (words.length) {
    header = `const { ${words.join(", ")} } = require("yao-node-client");`;
    data.push(header);
  }
  data.push(fileContent);

  let tail = "";
  if (functionNames.length) {
    tail = `module.exports = { ${functionNames.join(", ")} };`;
    data.push(tail);
  }

  // save to new file
  fs.writeFileSync(filename, data.join("\n"));
  console.log(`File ${filename} updated and saved!`);
}

function fixCodes(folder) {
  let files = GetAllJsFiles(folder);
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
        default: "",
      },
      target: {
        alias: "t",
        type: "string",
        default: "",
      },
      file: {
        alias: "f",
        type: "string",
        default: "",
      },
    })
    .parseSync();

  let sourceFolder = argv.source;

  if (sourceFolder === "") {
    require("dotenv").config();
    if (process.env.YAO_APP_ROOT) {
      sourceFolder = process.env.YAO_APP_ROOT;
    }
  }
  sourceFolder = path.resolve(sourceFolder);

  let targetFolder = argv.target;

  if (targetFolder === "") {
    require("dotenv").config();
    if (process.env.LOCAL_APP_ROOT) {
      targetFolder = process.env.LOCAL_APP_ROOT;
    }
  }
  targetFolder = path.resolve(targetFolder);

  let sourceFile = path.resolve(argv.file);

  FixFolderAndFile(sourceFolder, targetFolder, sourceFile, fixCodes, fixFile);
}

main();
