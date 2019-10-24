/*
 * @Author: qiansc
 * @Date: 2019-05-08 19:07:27
 * @Last Modified by: qiansc
 * @Last Modified time: 2019-05-09 18:57:41
 */

export interface IFile extends IFISFile, IGulpFile {}

interface IFISFile {
  getHashRelease?: () => string;
  getContent?: () => string;
  subpath?: string;
}
export interface IGulpFile {
  contents?: Buffer;
  relative?: string;
  stat?: any;
  path?: string;
}
