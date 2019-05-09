/*
 * @Author: qiansc
 * @Date: 2019-05-09 15:38:43
 * @Last Modified by: qiansc
 * @Last Modified time: 2019-05-09 19:04:47
 */
import { Deploy, IOptions } from './deploy';
import { IGulpFile } from './file';

/** 因为gulp处理是流式的 处理好的文件是依次序push 需要一个节流器收集一批批文件 并按照批次调用HTTP请求发送 */
export class Restrictor {
  private timeout: number = 300;
  private timer: NodeJS.Timeout;
  private fileCache: IGulpFile[] = [];
  private optionCache: IOptions[] = [];
  private status: 'UPLOADING' | 'WAIT' = 'WAIT';
  private injectCallBack: (() => void) | undefined;
  constructor() {
    // do nothing
  }
  public add(options: IOptions, file: IGulpFile) {
    this.fileCache.push(file);
    this.optionCache.push(options);
    this.setTimer();
  }

  private setTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.push();
    }, this.timeout);
  }
  private push() {
    if (this.status === 'UPLOADING') {
      this.setTimer();
    } else {
      this.status = 'UPLOADING';
      Deploy(this.optionCache, this.fileCache, [] , () => {
        this.status = 'WAIT';
        console.log('\n');
      });
    }
  }
}
