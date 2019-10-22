/*
 * @Author: qiansc
 * @Date: 2019-05-07 10:48:26
 * @Last Modified by: qiansc
 * @Last Modified time: 2019-05-09 20:01:34
 */
import { IFile } from './file';
import * as Token from './token';
import { upload } from './upload';
import { requireEmail } from './util';

/** 兼容FIS3-DEPLOY-HTTP-PUSH的Deploy方法 可以直接替换其对应FIS插件 */
export function Deploy(options: IOptions | IOptions[], modified: IFile[], total, callback) {
  const info = Token.getToken();

  const steps: any[] = [];

  modified.forEach((file, index) => {
    const option = Array.isArray(options) ? options[index] : options;
    const to = option.to;
    let receiver = option.receiver;
    let authApi = option.authApi;
    let validateApi = option.validateApi;
    // const data = options.data || {};
    if (option.host) {
      receiver = option.receiver = option.host + '/v1/upload';
      authApi = option.authApi = option.host + '/v1/authorize';
      validateApi = option.validateApi = option.host + '/v1/validate';
    }

    if (receiver === undefined) {
      throw new Error('options.receiver is required!');
    }

    let reTryCount = option.retry;

    steps.push(function reduce(next) {
      upload(receiver, to, info,
        file.getHashRelease ? file.getHashRelease() : file.relative,
        file.contents,
        file, (error) => {
        if (error) {
          if (error.errno > 100000) {
            // 检测到后端限制了上传，要求用户输入信息再继续。

            if (!authApi || !validateApi) {
              throw new Error('options.authApi and options.validateApi is required!');
            }

            if (info.email) {
              console.error('\nToken is invalid: ', error.errmsg, '\n');
            }

            requireEmail(authApi, validateApi, info, (err) => {
              if (err) {
                throw new Error('Auth failed! ' + error.errmsg);
              } else {
                reduce(next);
              }
            });
          } else if (option.retry && !--reTryCount) {
            throw new Error(error.errmsg || error);
          } else {
            reduce(next);
          }
        } else {
          return next();
        }
      });
    });
  });

  steps.reduceRight((next, current, currentIndex: number, arr) => {
    return () => {
      current(next);
    };
  }, callback)();

}

export interface IOptions {
  authApi?: string;
  /** reciever host */
  host?: string;
  /** base Path on remote , such as /home/work/odp/template/wise/zh-CN/page */
  to: string;
  receiver?: string;
  validateApi?: string;
  retry: number;
}
