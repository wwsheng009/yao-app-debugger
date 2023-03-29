# 在 yao 中调用远程代码

在 ts 项目中启动本地开发代理服务器。

```sh
pnpm run start
```

在执行完`pnpm run start`后，在开发目录下会启动一个 express 的 web 服务器，服务器会加载 yao 的 api 下的 http 路由配置并进行监听，同时会加载 yao 目录下的 public 的内容。可以直接使用 web 服务器提供的地址进行 api 测试。最大的好处的是可以调试代码。

**注意:** 需要配置环境变量 YAO_APP_ROOT.

> 测试调试代理是否成功

有些场景下，需要从 yao 的 json 配置文件中访问开发目录中的 ts 代码。那么就按`src/app/scripts/remote.js`的格式封装一个函数。如果调用处理的地方支持自定义函数，也可以使用以下的格式。

- 参数 1(scripts.jsproxy.RemoteProcess)是一个代理调用函数，
- 参数 2(scripts.ping.Ping),开发中的 ts 处理器,
- 剩余的是处理器的参数。

代码封装调用

```js
Process("scripts.jsproxy.RemoteProcess", "scripts.ping.Ping", ...args);
```

命令行调用，在 yao app 目录下执行

```sh
yao run scripts.remote.Ping 'hello'
```

调用成功会返回以下内容

```sh
$ yao run scripts.remote.Ping 'hello'

运行: scripts.remote.Ping
args[0]: hello
--------------------------------------
scripts.remote.Ping 返回结果
--------------------------------------
{
    "code": 200,
    "data": "Pong",
    "message": ""
}
--------------------------------------
✨完成✨
```
