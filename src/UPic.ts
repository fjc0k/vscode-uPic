import exec from 'execa'

export interface UPicOptions {
  cliPath: string
}

export class UPic {
  constructor(private readonly options: UPicOptions) {}

  async upload(files: string[]): Promise<string[]> {
    const uploadResult = await exec(this.options.cliPath, [
      '--upload',
      ...files,
      '--output',
      'url',
    ])
    const urls =
      uploadResult.stdout
        .split('Output URL:')[1]
        ?.split('\n')
        .map(url => url.trim())
        .filter(Boolean) || []
    return urls
  }
}
