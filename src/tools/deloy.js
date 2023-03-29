const fs = require("fs");

function main() {
  require("dotenv").config();
  if (process.env.YAO_APP_ROOT === "") {
    console.log("请设置环境变量：YAO_APP_ROOT");
    return;
  }
  if (process.env.YAO_API_ACCESS_KEY === "") {
    console.log("请设置环境变量：YAO_API_ACCESS_KEY");
    return;
  }

  copyFile("apis/proxy.http.json");
  copyFile("scripts/jsproxy.js");
  copyFile("scripts/security.js");
  copyFile("scripts/remote.js");
}

function copyFile(fileName) {
  let sourceFolder = path.resolve("./src/app");
  let targetFolder = path.resolve(process.env.YAO_APP_ROOT);

  if (!fs.existsSync(path.join(targetFolder, fileName))) {
    fs.copyFileSync(
      path.join(sourceFolder, fileName),
      path.join(targetFolder, fileName)
    );
  } else {
    console.log(`配置文件${fileName}已存在，请检查！`);
  }
}

function copyConfig() {
  let targetFolder = path.resolve(process.env.YAO_APP_ROOT);
  let targetFile = path.join(targetFolder, ".env");
  fs.appendFileSync(
    targetFile,
    `YAO_API_ACCESS_KEY=${process.env.YAO_API_ACCESS_KEY}`
  );

  fs.appendFileSync(
    targetFile,
    `REMOTE_DEBUG_SERVER=http://localhost:${process.env.PORT}/api/proxy/call`
  );
}
main();
