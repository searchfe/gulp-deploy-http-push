import { File } from 'gulp-util';
import { Transform } from 'readable-stream';
import { include } from './filter';
import { Restrictor } from './restrictor';

export function push (options: PushOptions) {
    const restrictor = new Restrictor();
    return new Transform({
        objectMode: true,
        transform: (file: File, enc, callback) => {
            if (!file.isDirectory()) {
                restrictor.add({
                    host: options.host,
                    retry: 2,
                    to: options.to
                }, {
                    contents: file.contents,
                    relative: '/' + file.relative
                });
            }
            callback();
        }
    });
}

interface PushOptions {
  /** 要部署的机器HOST */
  host: string;
  /** 要部署的basePath */
  to: string;
}
