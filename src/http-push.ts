/*
 * @Author: qiansc
 * @Date: 2019-05-09 13:04:45
 * @Last Modified by: qiansc
 * @Last Modified time: 2019-05-09 19:13:40
 */

import { File } from 'gulp-util';
import { include } from './filter';
import { Restrictor } from './restrictor';
import stream = require('readable-stream');
const Transform = stream.Transform;

export function httpPush (options: IDeployOption[]) {
    console.log('[gulp-deploy-http-push] httpPush() is deprecated, use push() instead');
    const restrictor = new Restrictor();
    return new Transform({
        objectMode: true,
        transform: (file: File, enc, callback) => {
            if (!file.isDirectory()) {
                options.forEach((option) => {
                    if (!option.match || (option.match && include(file.path, option.match, {
                        root: file.base
                    }))) {
                        restrictor.add({
                            host: option.host,
                            retry: 2,
                            to: option.to

                        }, {
                            contents: file.contents,
                            relative: '/' + file.relative
                        });
                        // 在match名单中
                        // console.log(option.to, file.path);
                    }
                });
            }
            callback();
        }
    });
}

interface IDeployOption {
  /** 要部署的机器HOST */
  host: string;
  /** 符合条件的文件的glob */
  match?: string;
  /** 要部署的basePath */
  to: string;
}
