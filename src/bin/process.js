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
  let p = args[0];
  let params = args.slice(1);
  console.log(`😀 call process:${p},params:${params}`);
  params = params.map((param) => {
    if (param.startsWith("::")) {
      param = JSON.parse(param.slice(2));
    }
    return param;
  });
  let data = Process(p, ...params);
  console.log(data);
}
main();
