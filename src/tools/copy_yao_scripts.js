const path = require("node:path");
const fs = require("fs");
const { PatchFile } = require("./lib");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const {
  FixFolderAndFile,
  GetAllJsFiles,
  CheckIsJsFile,
  FixFile,
} = require("./utils");

function fixFolderCallback(folder) {
  let files = GetAllJsFiles(folder);
  for (const file of files) {
    PatchFile(file, folder);
  }
}
function fixFileCallback(fname) {
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
      target_file: {
        alias: "o",
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

  let targetAppFolder = argv.target;

  if (targetAppFolder === "") {
    require("dotenv").config();
    if (process.env.LOCAL_APP_ROOT) {
      targetAppFolder = process.env.LOCAL_APP_ROOT;
    }
  }

  const local = path.resolve("./");
  const target = path.resolve(targetAppFolder);
  if (!target.includes(local)) {
    console.log("Error:目标目录不在调试器目录内，请检查配置！");
    return;
  }

  CopyDefaultFiles(targetAppFolder);

  let sourceFile = argv.file;
  let targetFile = argv.target_file;

  FixFolderAndFile(
    sourceFolder,
    targetAppFolder,
    sourceFile,
    targetFile,
    fixFolderCallback,
    fixFileCallback
  );
}
function CopyDefaultFiles(targetAppFolder) {
  FixFile(
    "src/app/scripts/jsproxy.js",
    path.join(targetAppFolder, "scripts/jsproxy.js"),
    fixFileCallback
  );
  FixFile(
    "src/app/scripts/security.js",
    path.join(targetAppFolder, "scripts/security.js"),
    fixFileCallback
  );
  FixFile(
    "src/app/scripts/ping.js",
    path.join(targetAppFolder, "scripts/ping.js"),
    fixFileCallback
  );
  fs.mkdirSync(path.join(targetAppFolder, "apis"), {
    recursive: true,
  });
  fs.copyFileSync(
    "src/app/apis/proxy.http.json",
    path.join(targetAppFolder, "apis/proxy.http.json")
  );
}

main();

// const targetAppFolder =
//   "/data/projects/yao/demos-v1.0/yao-node-projects/packages/yao-app-debugger/dist/source/app";
// FixFile(
//   "src/app/scripts/jsproxy.js",
//   path.join(targetAppFolder, "scripts/jsproxy.js"),
//   fixFileCallback
// );
