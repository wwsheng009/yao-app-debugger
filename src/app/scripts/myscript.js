const { Process } = require("yao-node-client");

function main() {
  let res = Process("utils.str.Concat", "hello", new Date());
  console.log(res);
}
function calllocal() {
  let res = Process("scripts.sub.demo.Main", "hello", "12312");
  console.log(res);
}
