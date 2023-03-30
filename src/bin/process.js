const { Process } = require("yao-node-client");

function main() {
  let args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("请指定处理器");
    return;
  }
  let p = args[0];
  let params = args.slice(1);
  console.log(`😀 call process:${p},params:${params}`);

  let data = Process(p, ...params);
  console.log(data);
}
main();
