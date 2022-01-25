import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import { Config } from "../interfaces/config";

export async function bundle(dirPath: string, config: Config) {
  async function bys(file: string, dirPath: string): Promise<string> {
    const bundle = file.match(/(?<=[//] @bys-import )(.*)(?= [\\])/);

    if (!bundle) return file;

    const current_directory = path.join(dirPath, bundle[0]).split(path.sep);

    let invoked_file = readFileSync(path.join(dirPath, bundle[0]), {
      encoding: "utf8",
    });

    if (config.transpilers?.length) {
      const extention = "." +
        current_directory[current_directory.length - 1].split(".")[1];

      if (extention.length)
        for (const transpiler of config.transpilers) {
          if (transpiler.extentions!.exec(extention)?.length)
            invoked_file = await transpiler.execute!(invoked_file);
        }
    }

    current_directory.pop();

    return await bys(
      file.replace(/(?=\/\/ @bys-import )(.*)(?<= \\\\)/, invoked_file),
      current_directory.join(path.sep)
    );
  }

  let res = await bys(
    readFileSync(path.join(dirPath, config.entry!), {
      encoding: "utf8",
    }),
    dirPath
  );

  if (config.transpiler) res = await config.transpiler(res);

  if (!existsSync(config.output!.path!))
    mkdirSync(config.output!.path!, { recursive: true });

  writeFileSync(
    path.join(config.output!.path!, config.output!.filename! + config.output!.extention),
    res,
    {
      encoding: "utf8",
    }
  );
}
