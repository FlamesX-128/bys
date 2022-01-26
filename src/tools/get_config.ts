/*

  MIT License

  Copyright (c) 2022 FlamesX128

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*/

import { existsSync } from "fs";
import { join } from "path";

import { ParsedArgs } from "minimist";

import { Config } from "../interfaces/config";

export async function get_config(args: ParsedArgs, dirPath: string): Promise<Config> {
  let config_file: Config = await (async () => {
    const filePath = join(dirPath, "bys.config.js");

    if (existsSync(filePath)) return (await import(filePath)).default;

    return {};
  })();

  function check_config(props: string[]): any {
    let config: any = config_file;

    for (const prop of props) {
      if (!Object.keys(config).includes(prop)) return undefined;

      config = config[prop];
    }

    return config;
  }

  const valid_flags: [string, any][] = [
    ["entry", undefined],
    ["output-extention", ".js"],
    ["output-filename", "bundle"],
    ["output-path", dirPath],
  ];

  valid_flags.map(([flag, alt]): void => {
    const value = args[flag] || check_config(flag.split("-")) || alt;
    const props = flag.split("-");

    eval(`config_file.${props.join(".")} = value`);
  });

  if (!config_file.entry)
    throw new Error(
      'An entry is needed, you can create a bys.config.js file or use the flag: --entry="your_main_file"'
    );

  return config_file;
}
