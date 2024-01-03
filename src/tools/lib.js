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

  let lines = data.split("\n");
  const regexReuire = /require\("(.+?)"\);/;

  // replace the require
  lines = lines.map((line) => {
    line = line.replace(regexReuire, (match, p1) => {
      let str = p1.replace("../scripts/", "");
      const replacedContent = str.replace(/\//g, ".");
      return `Require("${replacedContent}");`;
    });
    return line;
  });
  data = lines.join("\n");

  if (content != data) {
    fs.writeFileSync(filename, data);
    console.log(`文件已更新：${filename} !`);
  }
}

/**
 * 简单处理js文件
 * @param filename 文件名
 * @param folder 目录
 */
function PatchFile(filename, folder) {
  if (!fs.existsSync(filename)) {
    return;
  }

  const fileContent = fs.readFileSync(filename, "utf8");
  // Define the regular expression to match function names
  const regex = /^function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/g;

  // Find all matches
  // scan all the function name, will export them later
  const functionNames = [];

  let lines = fileContent.split("\n");

  const regexReuire = /Require\("(.+?)"\);/;

  // replace the require
  lines = lines.map((line) => {
    line = line.replace(regexReuire, (match, p1) => {
      // always relative to script folder
      const replacedContent = "../scripts/" + p1.replace(/\./g, "/");
      return `require("${replacedContent}");`;
    });
    return line;
  });

  // Filter out lines that start with "//" or "/*"
  const filteredLines = lines.filter(
    (line) => !line.trim().startsWith("//") && !line.trim().startsWith("/*")
  );
  // Check if remaining lines contain the string "new Query"

  let words = filteredLines.reduce((result, line) => {
    let matchFuntion;
    while ((matchFuntion = regex.exec(line)) !== null) {
      if (!functionNames.includes(matchFuntion[1])) {
        functionNames.push(matchFuntion[1]);
      }
    }
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

  // new file content
  let data = [];
  let header = "";
  if (words.length) {
    header = `const { ${words.join(", ")} } = require("yao-node-client");`;
    data.push(header);
  }
  data = data.concat(...lines);

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
