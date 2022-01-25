#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

import { join, resolve, sep } from "path";

import minimist, { ParsedArgs } from "minimist";

import { get_config } from "./tools/get_config";
import { bundle } from "./tools/bundle";
import { Config } from "./interfaces/config";

(async function main(): Promise<void> {
  const args: ParsedArgs = minimist(process.argv.slice(2)),
    directory: string = process.cwd();

  const config = await get_config(directory, args);

  await bundle(directory, config);
})();
