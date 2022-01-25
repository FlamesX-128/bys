import { existsSync } from "fs";
import { ParsedArgs } from "minimist";
import { join } from "path";
import { Config } from "../interfaces/config";

export async function get_config(dirPath: string, args: ParsedArgs) {
  let [bys, pke] = await Promise.all(
    ["bys.config.js", "package.json"].map(async (file) => {
      const path = join(dirPath, file);

      if (existsSync(path)) return await import(path);

      return {};
    })
  );

  let config: Config = {
    entry: args["entry"] ? args["entry"] : bys.entry ? bys.entry : pke.main,
    output: {},
    transpiler: bys.transpiler,
    transpilers: bys.transpilers,
  };

  if (!config.entry)
    throw new Error(
      "An entry is needed, you can create a package.json, bys.config.js or use the flag \"--entry='your_main_file'\""
    );

  [
    ["filename", pke.main || "bundle"],
    ["path", dirPath],
    ["extention", ".js"]
  ].map(([prop, alt]: string[]) => {
    config["output"]![prop as "filename" | "path"] = args[`output-${prop}`]
      ? args[`output-${prop}`]
      : bys["output"] && bys["output"][prop]
        ? bys["output"][prop]
        : alt;
  });

  return config;
}
