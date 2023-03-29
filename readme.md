# YAO 应用开发脚本调试工具

## 开发环境准备

```sh
git clone https://github.com/wwsheng009/yao-app-debugger
cd yao-app-debugger
pnpm i
```

### 设置环境变量

```sh
cp .env.sample .env
```

- `YAO_APP_PROXY_ENDPOINT`
  `Yao`应用的访问`API`地址,一般设置成`http://localhost:5099/api/proxy/call`
  `
- `YAO_API_ACCESS_KEY`
  为了接口安全，请设置此变量。**同时需要在 `YAO`应用目录下的`.env`文件中设置此环境变量**

- `YAO_APP_ROOT`
  `YAO`应用的根目录，比如：`/data/projects/yao/demos-v1.0/yao-chatgpt/`

- `LOCAL_APP_ROOT`
  本地脚本的目录，设置成`./dist/source/app`

## `Yao`应用设置

Yao 应用需要作些配置。

执行脚本复制一些必要的文件到 yao 应用目录

```sh
pnpm run "deloy:config"
```

## 启动 yao 服务。

```sh
yao start
```

## 复制 Yao 脚本到本地。

使用脚本把 Yao 脚本复制到本地目录 dist/source/app。

```sh
pnpm run copy:source
```

`Yao`应用启动后，就可以本项目中调用所有`yao`应用中的处理器与`API`。

处理器的调用方法，按 yao 脚本的格式进行处理即可。比如调用处理器就使用 Process 函数。调用查询就用 new Query()对象。在 nodejs 中已经封装了相关的函数与对象。

## vscode 调试

`vscode`环境下已内置调试配置：

- `Launch Yao Script`

## 注意

如果是开发`studio`脚本,并且在脚本中有写`dsl`文件的操作。，`Yao`的环境变量需要修改成正式模式,防止在脚本运行过程中运行环境被不断的重载

```sh
YAO_ENV="production"

```

## 布署

生成新的目录 dist/target/app。检查后再手动布署到 Yao 应用。

```sh
pnpm run copy:target
``
```
