const {
  Process,
  log,
  $L,
  Store,
  Exception,
  FS,
  http,
  Studio,
  WebSocket,
  Query,
} = require("yao-node-client");

function callscript() {
  const data = Process("scripts.myscript.main");
  console.log(data);
}
// callscript();

function callquery() {
  const q = new Query();
  const data = q.Get({
    select: ["description"],
    from: "$ai.setting",
    wheres: [{ field: "default", op: "=", value: true }],
  });
  console.log(data);
}

callquery();
