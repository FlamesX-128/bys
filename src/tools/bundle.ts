import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { join } from "path";


export async function bundle(directory: string, config: Config): Promise<void> {
  const res = await (async function bys(file: string, dir: string): Promise<string> {
    const bundle = file.match(/(?<=[//] @bys-import )(.*)(?= [\\])/);

    if (!bundle) return file;

    // This is to know which directory is currently.
    const nextDir: string[] = path.join(dir, bundle[0]).split(path.sep);
    nextDir.pop();

    return await bys(
      file.replace(
        /(?=\/\/ @bys-import )(.*)(?<= \\\\)/,
        readFileSync(path.join(dir, bundle[0]), {
          encoding: "utf8",
        })
      ),
      nextDir.join(path.sep)
    );
  })(
    readFileSync(path.join(directory, config.entry!), {
      encoding: "utf8",
    }),
    directory
  );


  const outDir: string = path.join(directory, config.output!.dirname!);


  if (outDir !== directory && !existsSync(outDir))
    mkdirSync(outDir, { recursive: true });


  writeFileSync(join(outDir, config.output!.filename!), res, {
    encoding: "utf8",
  });

}
