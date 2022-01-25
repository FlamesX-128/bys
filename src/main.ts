#!/usr/bin/env node

import path from "path";

import minimist, { ParsedArgs } from "minimist";

import { get_config } from "./tools/get_config";
import { bundle } from "./tools/bundle";
import { Config } from "./interfaces/config";

(async function main(): Promise<void> {
  const args: ParsedArgs = minimist(process.argv.slice(2)),
    directory: string = process.cwd();

  const config = await get_config(directory, args);

  const current_directory = path.join(directory, config.entry!).split(path.sep);
  config.entry = current_directory[current_directory.length - 1];
  current_directory.pop();

  await bundle(current_directory.join(path.sep), config);
})();

export = Config