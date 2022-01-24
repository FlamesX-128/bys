import { readFileSync, existsSync } from "fs";
import { join } from "path";

import { ParsedArgs } from "minimist";

export function get_config(directory: string, args: ParsedArgs): Config {
  const [bys, pke] = ["bys.config", "package"].map(function (
    file: string
  ): any {
    const path = join(directory, file + ".json");

    if (existsSync(path))
      return JSON.parse(readFileSync(path, { encoding: "utf8" }));

    return {};
  });

  let config: Config = {
    entry: args["entry"] ? args["entry"] : bys.entry ? bys.entry : pke.main,
    output: {},
  };

  if (!config.entry)
    throw new Error(
      "An entry is needed, you can create a package.json, bys.config.json or use the flag \"--entry='your_main_file'\""
    );

  const ext = config.entry!.split(".");

  [("filename-bundle." + ext[ext.length - 1]), "dirname"].map(function (property: string): void {
    const [prop, name] = property.split("-");

    config["output"]![prop as "filename" | "dirname"] = args["output-" + prop]
      ? args["output-" + prop]
      : bys["output"] && bys["output"][prop]
      ? bys["output"][prop]
      : name && name !== ""
      ? name
      : "";
  });

  return config;
}
