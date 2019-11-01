import * as crypto from 'crypto';
import { ensureDirSync, pathExistsSync, removeSync, writeFileSync } from 'fs-extra';
import { File } from 'gulp-util';
import { resolve } from 'path';
function getMd5 (str: string) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(str, 'utf8');
    return md5sum.digest('hex').substring(0, 32);
}
export const defaultCachePath: string = resolve(process.cwd(), 'node_modules/gulp-deploy-http-push/http-cache/');
export function saveCache (file: File, cachePath: string) {
    writeFileSync(resolve(cachePath + '/' + getMd5(file.path + file.stat.mtimeMs + file.stat.ctimeMs)), '');
}
export function deleteCache (dirPath: string = defaultCachePath) {
    removeSync(dirPath);
}
export function mkdirsSync (cachePath: string) {
    ensureDirSync(cachePath);
}
export function hasCache (cachePath: string, file: File): boolean {
    return pathExistsSync(resolve(cachePath + '/' + getMd5(file.path + file.stat.mtimeMs + file.stat.ctimeMs)));
}
