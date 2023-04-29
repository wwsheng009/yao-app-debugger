require("dotenv").config();
const path = require("node:path");
const fs = require("fs");

function CheckConfig() {
  const source = path.resolve(process.env.YAO_APP_ROOT);
  if (
    !fs.existsSync(path.join(source, "apis/proxy.http.json")) ||
    !fs.existsSync(path.join(source, "scripts/jsproxy.js"))
  ) {
    console.log("没有找到代理文件，请确认是否已经布署调试脚本");
    return false;
  }
  return true;
}
module.exports = CheckConfig;
