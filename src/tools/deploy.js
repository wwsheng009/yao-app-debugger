const fs = require("fs");
const path = require("node:path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      env: {
        alias: "e",
        type: "string",
        default: ".env",
      },
    })
    .parseSync();
  let targetEnvFile = argv.env;

  require("dotenv").config();
  if (process.env.YAO_APP_ROOT === "") {
    console.log("请设置环境变量：YAO_APP_ROOT");
    return;
  }
  if (process.env.YAO_API_ACCESS_KEY === "") {
    console.log("请设置环境变量：YAO_API_ACCESS_KEY");
    return;
  }

  if (process.env.NODE_PORT === "") {
    console.log("请设置环境变量：NODE_PORT");
    return;
  }

  copyFile("apis/proxy.http.json");
  copyFile("scripts/jsproxy.js");
  copyFile("scripts/security.js");
  copyFile("scripts/remote.js");

  UpdateEnvConfig(targetEnvFile);
}

function copyFile(fileName) {
  let sourceFolder = path.resolve("./src/app");
  let targetFolder = path.resolve(process.env.YAO_APP_ROOT);

  if (!fs.existsSync(path.join(targetFolder, fileName))) {
    fs.copyFileSync(
      path.join(sourceFolder, fileName),
      path.join(targetFolder, fileName)
    );
    console.log(`文件已复制:${fileName}`);
  } else {
    console.log(`文件:${fileName}已存在，请检查！`);
  }
}

function UpdateEnvConfig(envFile) {
  let targetFolder = path.resolve(process.env.YAO_APP_ROOT);
  let targetFile = path.join(targetFolder, envFile);

  let data = fs.readFileSync(targetFile, "utf8");
  data = updateEnv(
    data,
    "YAO_API_ACCESS_KEY",
    process.env.YAO_API_ACCESS_KEY,
    "本地调试服务器接口密钥"
  );

  data = updateEnv(
    data,
    "REMOTE_DEBUG_SERVER",
    `http://localhost:${process.env.NODE_PORT}/api/proxy/call`,
    "调试服务接口"
  );

  fs.writeFileSync(targetFile, data);
  console.log(`配置文件:${targetFile}已更新。`);
}

function updateEnv(data, key, value, comment) {
  // Check if the .env file contains the key
  if (data.includes(`${key}=`)) {
    // If the key already exists, update its value
    const regex = new RegExp(`${key}=.*`);
    data = data.replace(regex, `${key}="${value}"`);
  } else {
    // If the key does not exist, append a new config key
    data += `\n#${comment}\n${key}="${value}"`;
  }
  return data;
}
main();

// YAO 引擎并不能直接运行 ts 脚本，需要把 ts 脚本转换成 js 后 yao 才能执行。在代码开发阶段,TS 与 YAO-JS 之间利用 CLIENT-SERVER 架构进行调试与测试。需要先进行开发环境的配置。

// - 复制`src/app/apis/proxy.http.json`到`YAO`应用目录的`apis`目录下
// - 复制`src/app/scripts/jsproxy.js`到`YAO`应用目录的`scripts`子目录下
// - 复制`src/app/scripts/security.js`到`YAO`应用目录的`scripts`子目录下
// - 复制`src/app/scripts/remote.js`到`YAO`应用目录的`scripts`子目录下，后面如果需要从`yao`调用开发目录的脚本就按这个格式进行封装代码。

// 在`yao`目录下的`.env`文件里加上环境变量

// ```sh
// REMOTE_DEBUG_SERVER="http://localhost:8082/api/proxy/call"
// YAO_API_ACCESS_KEY='Your_key'
// ```
