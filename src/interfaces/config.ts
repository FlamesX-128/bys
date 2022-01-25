export interface Config {
  entry?: string,
  output?: {
    extention?: string,
    filename?: string,
    path?: string
  },
  transpiler?(code: string): Promise<string> | string
  transpilers?: {
    execute?(code: string): Promise<string> | string,
    extentions?: RegExp
  }[]
}