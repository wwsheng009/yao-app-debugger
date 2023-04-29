const { Process } = require("yao-node-client");
const CheckConfig = require("./lib");

function main() {
  if (!CheckConfig()) {
    return;
  }

  let args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("请指定处理器");
    return;
  }
  let p = `services.${args[0]}`;
  let params = args.slice(1);
  console.log(`😀 call service:${p},params:${params}`);

  let data = Process(p, ...params);
  console.log(data);
}
main();
