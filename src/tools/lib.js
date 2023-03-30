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
    console.log(`文件已更新：${filename} !`);
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

  const lines = fileContent.split("\n");

  // Filter out lines that start with "//" or "/*"
  const filteredLines = lines.filter(
    (line) => !line.trim().startsWith("//") && !line.trim().startsWith("/*")
  );
  // Check if remaining lines contain the string "new Query"

  let words = filteredLines.reduce((result, line) => {
    let match = line.match(/\s(log|http)\./);
    if (match) {
      if (match[1]) {
        if (!result.includes(match[1])) {
          result.push(match[1]);
        }
      }
    }

    match = line.match(/\s(Process|Studio)\(/);
    if (match) {
      if (match[1]) {
        if (!result.includes(match[1])) {
          result.push(match[1]);
        }
      }
    }
    match = line.match(/\snew\s(Store|Exception|FS|WebSocket|Query)\(/);
    if (match) {
      if (match[1]) {
        if (!result.includes(match[1])) {
          result.push(match[1]);
        }
      }
    }

    return result;
  }, []);

  // let words = [];
  // if (filteredLines.some((line) => /\slog\./.test(line))) {
  //   words.push("log");
  // }

  // if (filteredLines.some((line) => /\shttp\./.test(line))) {
  //   words.push("http");
  // }

  // if (filteredLines.some((line) => /\snew\s*Store\(/.test(line))) {
  //   words.push("Store");
  // }

  // if (filteredLines.some((line) => /\snew\s*Exception\(/.test(line))) {
  //   words.push("Exception");
  // }

  // if (filteredLines.some((line) => /\snew\s*FS\(/.test(line))) {
  //   words.push("FS");
  // }

  // if (filteredLines.some((line) => /\snew\s*WebSocket\(/.test(line))) {
  //   words.push("WebSocket");
  // }

  // if (filteredLines.some((line) => /\snew\s*Query\(/.test(line))) {
  //   words.push("Query");
  // }

  // if (filteredLines.some((line) => /\sProcess\(/.test(line))) {
  //   words.push("Process");
  // }
  // if (filteredLines.some((line) => /\sStudio\(/.test(line))) {
  //   words.push("Studio");
  // }

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
  console.log(`文件已更新：${filename}`);
}

module.exports = { CleanupFile, PatchFile };
