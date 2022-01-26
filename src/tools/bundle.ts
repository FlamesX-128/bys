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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import { Config } from "../interfaces/config";
import { get_paths } from "./get_paths";

export async function bundle(dirPath: string, fileName: string, config: Config) {

  async function transpile_file(file: string, fileName: string): Promise<string> {
    if (!config.transpilers) return file;

    for (const transpiler of config.transpilers) {
      if (!transpiler.execute || !transpiler.extentions)
        throw new Error('Transpilers must have the method "execute" and the property "extensions"!');

      if (!transpiler.extentions.exec(fileName)) continue;

      file = await transpiler.execute(file);
    }

    return file;
  }


  async function import_file(file: string, dirPath: string): Promise<string> {
    const bundle = file.match(/(?<=[//] @bys-import )(.*)(?= [\\])/);

    if (!bundle) return file;


    const [dir_path, file_name] = get_paths(path.join(dirPath, bundle[0]));

    const required_file = readFileSync(path.join(dir_path, file_name), {
      encoding: "utf8",
    });

    const imported = await import_file(required_file, dir_path),
      transpiled = await transpile_file(imported, file_name);

    return await import_file(
      file.replace(/(?=\/\/ @bys-import )(.*)(?<= \\\\)/, transpiled),
      dirPath
    );
  }


  let file = await import_file(
    readFileSync(path.join(dirPath, fileName), {
      encoding: "utf8",
    }),
    dirPath,
  );

  
  if (config.transpiler) file = await config.transpiler(file);

  if (!existsSync(config.output!.path!))
    mkdirSync(config.output!.path!);


  writeFileSync(
    path.join(config.output!.path!, (config.output!.filename! + config.output!.extention!)),
    file,
    {
      encoding: "utf8",
    }
  );
}
