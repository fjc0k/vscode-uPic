import * as vscode from 'vscode'
import { Uploader, UploaderCopyKind } from './Uploader'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'uPic.uploadThenCopyUrls',
      (_, uris: vscode.Uri[]) => {
        const uploader = new Uploader({
          copyKind: UploaderCopyKind.urls,
        })
        uploader.upload(uris)
      },
    ),
    vscode.commands.registerCommand(
      'uPic.uploadThenCopyIndex',
      (_, uris: vscode.Uri[]) => {
        const uploader = new Uploader({
          copyKind: UploaderCopyKind.index,
        })
        uploader.upload(uris)
      },
    ),
  )
}
