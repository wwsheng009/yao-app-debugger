const fs = require("fs");

/**
 * 简单处理js文件
 * @param filename 文件名
 */
function CleanupFile(filename) {
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

/**
 * 简单处理js文件
 * @param filename 文件名
 */
function PatchFile(filename) {
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

module.exports = { CleanupFile, PatchFile };
