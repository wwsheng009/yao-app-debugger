# YAO 应用开发 Typescript 模板使用

使用 typescript 进行 yao 应用开发,包含必要的 TS 编译脚本配置。TS 开发测试脚本。

## 说明

项目内置了使用`ts`开发`yao`应用的各种工具。

比如在`ts`脚本文件中可以引用`yao`各种专有对象的方法

```js
import { Process, log, Exception, WebSocket } from "yao-node-client";
```

## 开发环境准备

```sh
git clone git@github.com:wwsheng009/yao-app-ts-template.git yao-app-ts
cd yao-app-ts
pnpm i
```

### 设置`TS`开发环境变量

```sh
cp .env.sample .env
```

- `YAO_APP_PROXY_ENDPOINT`
  `Yao`应用的访问`API`地址,一般设置成`http://localhost:5199/api/proxy/call`
  `

- `YAO_APP_ROOT`
  `YAO`应用的根目录，比如：`/data/projects/yao/demos-v1.0/yao-chatgpt/`

- `YAO_API_ACCESS_KEY`
  为了接口安全，请设置此变量。**同时需要在 `YAO`应用目录下的`.env`文件中设置此环境变量**

- `LOCAL_APP_ROOT`
  编译后的脚本的目录，设置成`dist/app`

## `Yao`应用设置

YAO 引擎并不能直接运行 ts 脚本，需要把 ts 脚本转换成 js 后 yao 才能执行。在代码开发阶段,TS 与 YAO-JS 之间利用 CLIENT-SERVER 架构进行调试与测试。需要先进行开发环境的配置。

- 复制`src/app/apis/proxy.http.json`到`YAO`应用目录的`apis`目录下
- 复制`src/app/scripts/jsproxy.js`到`YAO`应用目录的`scripts`子目录下
- 复制`src/app/scripts/security.js`到`YAO`应用目录的`scripts`子目录下
- 复制`src/app/scripts/remote.js`到`YAO`应用目录的`scripts`子目录下，后面如果需要从`yao`调用开发目录的脚本就按这个格式进行封装代码。

在`yao`目录下的`.env`文件里加上环境变量

```sh
REMOTE_DEBUG_SERVER="http://localhost:8082/api/proxy/call"
YAO_API_ACCESS_KEY='Your_key'
```

## 注意

如果是开发`studio`脚本,并且在脚本中有写`dsl`文件的操作。，`Yao`的环境变量需要修改成正式模式,防止在脚本运行过程中运行环境被不断的重载

```sh
YAO_ENV="production"

```

## 在 TS 中调用 Yao 脚本。

在`Yao`应用目录执行,这一步是必要的。

```sh
yao start
```

`Yao`应用启动后，就可以`ts`项目中调用所有`yao`应用中的处理器与`API`。

处理器的调用方法，按 yao 脚本的格式进行处理即可。比如调用处理器就使用 Process 函数。调用查询就用 new Query()对象。在 nodejs 中已经封装了相关的函数与对象。

## 在 yao 中调用 ts 代码

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

## 调试

`vscode`环境下已内置了两种调试配置：

- `TS-NODE Launch Yao Script`
- `Launch Yao Script`

## 编译

执行以下命令编译脚本

```sh
pnpm run yao:build-fix
```

复制目录`dist_esm/app/scripts`中的脚本到你的`Yao`应用目录

### 脚本打包合并

如果功能复杂的脚本，可以单独在目录`src/app/scripts`创建一个脚本目录,目录下创建一个`index.ts`。那么执行以下脚本，整个目录会被打包成一个`js`脚本。

```sh
pnpm run yao:pack
```
