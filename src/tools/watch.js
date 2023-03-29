const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { CleanupFile } = require("./cleanup");

function main() {
  require("dotenv").config();
  if (process.env.YAO_APP_ROOT === "") {
    console.log("请设置环境变量：YAO_APP_ROOT");
    return;
  }
  if (process.env.LOCAL_APP_ROOT === "") {
    console.log("请设置环境变量：LOCAL_APP_ROOT");
    return;
  }
  const sourceFolder = path.resolve(process.env.LOCAL_APP_ROOT);

  const tempFolder = path.resolve("./dist/target"); //process.env.YAO_APP_ROOT);

  const yaoAppFolder = path.resolve(process.env.YAO_APP_ROOT);

  const watcher = chokidar.watch(sourceFolder, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher
    .on("add", (filePath) => {
      const relativePath = path.relative(sourceFolder, filePath);
      const tempPath = path.join(tempFolder, relativePath);
      fs.mkdirSync(path.dirname(tempPath), { recursive: true });
      fs.copyFileSync(filePath, tempPath);
      CleanupFile(tempPath);

      const yaoDestPath = path.join(yaoAppFolder, relativePath);

      fs.mkdirSync(path.dirname(yaoAppFolder), { recursive: true });
      fs.copyFileSync(tempPath, yaoDestPath);
    })
    .on("change", (filePath) => {
      const relativePath = path.relative(sourceFolder, filePath);
      const tempPath = path.join(tempFolder, relativePath);
      fs.mkdirSync(path.dirname(tempPath), { recursive: true });
      fs.copyFileSync(filePath, tempPath);

      CleanupFile(tempPath);
      const yaoDestPath = path.join(yaoAppFolder, relativePath);
      fs.copyFileSync(tempPath, yaoDestPath);
    })
    .on("unlink", (filePath) => {
      const relativePath = path.relative(sourceFolder, filePath);
      const tempPath = path.join(tempFolder, relativePath);
      const yaoDestPath = path.join(yaoAppFolder, relativePath);
      fs.unlinkSync(tempPath);
      fs.unlinkSync(yaoDestPath);
    });
}
main();
