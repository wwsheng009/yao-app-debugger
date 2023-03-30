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

`Yao`应用启动后，调试器就可以远程调用所有`yao`应用中的处理器与`API`。

## 复制 Yao 脚本到本地。

使用脚本把 Yao 的 scripts/services/studio 目录复制到本地目录 dist/source/app。在复制的同时，脚本已针对每一个 js 文件作了处理，在文件头加上必要的引用。在文件尾部也加上必要的函数导出。

```sh
pnpm run copy:source
```

## 调试

## vscode 调试

`vscode`环境下已内置调试配置：

- `Launch Yao Script`

### node 脚本调试

```sh
# process
pnpm run bin:process scripts.test.echo 123 456

# studio
pnpm run bin:studio test.echo 123 456

# services
pnpm run bin:service test.echo 123 456
```

## 注意

如果是开发`studio`脚本,并且在脚本中有写`dsl`文件的操作。，`Yao`的环境变量`AO_ENV="production"`需要修改成正式模式,防止在脚本运行过程中运行环境被不断的重载

## 布署

### 实时复制

执行实时监控命令，如果目录 dist/source/app 下的 js 文件发生了变更，脚本自动处理并复制到 yao 应用目录。

```sh
pnpm run watch:source
```

### 复制整个目录

把 js 从源目录复制新目录。并作 js 文件转换，掐头去尾，删除头文件导出，与函数导出部分。检查后再手动布署到 Yao 应用。

- 源目录默认是 dist/source/app 下的 scripts/services/studio 子目录。
- 新目录默认是 dist/target/app 下的 scripts/services/studio 子目录。

**注意**：脚本会清空目标目录下所有的内容。请小心操作。

```sh
pnpm run copy:target
```
