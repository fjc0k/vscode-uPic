import * as vscode from 'vscode'
import clipboard from 'clipboardy'
import { join as joinPath, parse as parsePath } from 'path'
import { readdirSync, statSync } from 'fs'
import { UPic } from './UPic'

export enum UploaderCopyKind {
  urls,
  index,
}

export interface UploaderOptions {
  copyKind: UploaderCopyKind
}

export interface UploaderConfig {
  cliPath: string
}

export class Uploader {
  constructor(private readonly options: UploaderOptions) {}

  private getConfig(): UploaderConfig {
    const workbenchConfig = vscode.workspace.getConfiguration('uPic')
    const cliPath = workbenchConfig.get<string>('cliPath')!
    return { cliPath }
  }

  async upload(uris: vscode.Uri[]) {
    const files = uris
      .map(uri => {
        if (statSync(uri.fsPath).isDirectory()) {
          return readdirSync(uri.fsPath)
            .map(file => joinPath(uri.fsPath, file))
            .filter(file => statSync(file).isFile())
        }
        return [uri.fsPath]
      })
      .flat()
    const uploadingMessage = vscode.window.setStatusBarMessage(
      `${files.length} files uploading...`,
    )
    const config = this.getConfig()
    const uPic = new UPic({ cliPath: config.cliPath })
    const urls = await uPic.upload(files)
    if (this.options.copyKind === UploaderCopyKind.urls) {
      clipboard.writeSync(urls.join('\n'))
      uploadingMessage.dispose()
      vscode.window.setStatusBarMessage(
        `${files.length} files uploaded and urls copied.`,
        3000,
      )
    } else {
      const index = files.reduce<Record<string, string>>((res, file, index) => {
        res[parsePath(file).name] = urls[index]
        return res
      }, {})
      clipboard.writeSync(JSON.stringify(index, null, 2))
      uploadingMessage.dispose()
      vscode.window.setStatusBarMessage(
        `${files.length} files uploaded and index copied.`,
        3000,
      )
    }
  }
}
