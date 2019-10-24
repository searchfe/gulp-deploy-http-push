# gulp-deploy-http-push
![Language](https://img.shields.io/badge/-TypeScript-blue.svg)
[![Build Status](https://travis-ci.org/searchfe/gulp-deploy-http-push.svg?branch=master)](https://travis-ci.org/searchfe/gulp-deploy-http-push)
[![Coveralls](https://img.shields.io/coveralls/searchfe/gulp-deploy-http-push.svg)](https://coveralls.io/github/searchfe/gulp-deploy-http-push)
[![npm package](https://img.shields.io/npm/v/gulp-deploy-http-push.svg)](https://www.npmjs.org/package/gulp-deploy-http-push)
[![npm downloads](http://img.shields.io/npm/dm/gulp-deploy-http-push.svg)](https://www.npmjs.org/package/gulp-deploy-http-push)

gulp-deploy-http-push 是一个支持FSR安全推送部署的客户端插件，是 [fis3-deploy-http-push](https://github.com/fex-team/fis3-deploy-http-push) 的gulp版本，具备完全一样的功能：

- TOKEN验证
- TOKEN缓存
  - 优先共用FIS3的deploy配置 $HOME/.fis3-tmp/deploy.json，避免两种插件导致频繁验证
  - 其次使用$HOME/.gulp-deploy-http-push.json
- 文件推送

## Install

```bash
npm i gulp-deploy-http-push --save-dev
```

## Example

```Typescript
import * as gulp from 'gulp';
import { httpPush } from 'gulp-deploy-http-push';

const PUSH = 'http://xxxxx:8210';

gulp.src(
    `${__dirname}/src/**`, {
    base: `${__dirname}/src`,
  },
).pipe(httpPush([
  {
    host: PUSH,
    match: '/**/*.tpl',
    to: '/home/work/xxx/template/', // 注意这个是指的是测试机器的路径，而非本地机器
    cache: true // 是否使用缓存，默认缓存路径 ./node_modules/gulp-depoly-http-push/http-cache
  },
  {
    host: PUSH,
    match: '/static/**',
    to: '/home/work/xxx/webroot/', // 注意这个是指的是测试机器的路径，而非本地机器
    cache: true // 是否使用缓存，默认缓存路径 ./node_modules/gulp-depoly-http-push/http-cache
  },
]));

```

## API

[API DOC](https://searchfe.github.io/gulp-deploy-http-push/)

## 其他

核心代码重构自FIS3版本，因FSR接口不是开源的，所以核心实现保留写法（因此也不优雅）。模块导出的另一个Deploy方法，是支持FIS3流的一层封装，可验证功能或用于二次开发FIS3插件（目前可以完全替代fis3-deploy-http-push）。
