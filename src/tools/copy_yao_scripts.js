const path = require("node:path");
const { PatchFile } = require("./lib");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { FixFolderAndFile, GetAllJsFiles, CheckIsJsFile } = require("./utils");

function fixCodes(folder) {
  let files = GetAllJsFiles(folder);
  for (const file of files) {
    PatchFile(file);
  }
}
function fixFile(fname) {
  if (!CheckIsJsFile(fname)) {
    console.log("Not js file");
    return;
  }
  PatchFile(fname);
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
