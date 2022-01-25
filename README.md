# **Bundle your scripts (bys)**
Bys is an npm/yarn library to merge your js and ts files into one file.

## **Installation**
Use the [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [yarn](https://yarnpkg.com/getting-started/install) package manager to install bys.


```bash
# Using npm
npm i @flamesx128/bys -g
```

```bash
# Using yarn
yarn add @flamesx128/bys -g
```

## **Usage**
Bys needs to know what the main file is, by default it will look in the package.json file, but it can be specified by a bys.config.json file or by the "entry" flag.

### **Flags**
With the flags you can change how the program will work.

- **entry**
  + This flag specifies which is the main file.
  + Usage: `$ bys --entry="main.js"`
  + Required flag.

- **output-extention**
  + This flag specifies the extension that the file created by bys will have.
  + If not specified, defaults to ".js".
  + Usage: `$ bys --output-extention=".js"`
  + Optional flag.

- **output-filename**
  + This flag specifies what is the name of the file created by bys.
  + If not added, the default name is "bundle".
  + Usage: `$ bys --output-filename="bundle.js"`
  + Optional flag.

- **output-path**
  + This flag specifies the directory where the file created by bys is saved.
  + If not added, the file is placed in the directory where it was called bys.
  + Usage: `$ bys --output-path="main.js"`
  + Optional flag.

### **Configuration file**
You can create a configuration file for bys called `bys.config.js` with the following structure:

```ts
export interface Config {
  // Main file that read.
  entry?: string,
  output?: {
    // File extension to use when creating.
    extention?: string,
    // Name of the file that will be assigned when it is created.
    filename?: string,
    // Path of the directory where the file created by bys will be saved
    path?: string
  },
  // This method is to transpire the code at the end of joining the files.
  transpiler?(code: string): Promise<string> | string
  // This method is used to transpile the files at the moment they are read.
  transpilers?: {
    execute?(code: string): Promise<string> | string,
    extentions?: RegExp
  }[]
}
```

#### **Configuration file example**

```js
// File: bys.config.js
const { join } = require('path');

module.exports = {
  entry: 'main.js',
  output: {
    extention: ".js",
    filename: 'bundle',
    path: join(__dirname, "dist")
  },
  transpilers: []
}
```

### **Bys usage example**
Here are some examples of using bys with js and ts.

<details>
  <summary>Using JavaScript</summary>

  ```js
  // File: bys.config.js

  module.exports = {
    entry: 'main.js',
    output: {
      extention: ".js",
      filename: 'bundle',
      path: join(__dirname, "dist")
    }
  }
  ```

  ```js
  // File: sum.js

  const sum = (x, y) => x + y;
  ```

  ```js
  // @bys-import ./sum.js \\

  console.log(sum(2, 2));
  ```

  ```js
  // Result after using bys.
  // File: dist/bundle.js

  const sum = (x, y) => x + y;

  console.log(sum(2, 2));
  ```

</details>

<details>
  <summary>Using TypeScript</summary>

  ```js
  // File: bys.config.js
  const { transpile } = require('typescript');
  const { join } = require('path');

  module.exports = {
    entry: 'main.ts',
    output: {
      extention: ".js",
      filename: 'bundle',
      path: join(__dirname, "out")
    },
    transpiler: (code) => transpile(code, {
      /* Language and Environment */
      target: "es2016",

      /* Modules */
      module: "AMD",
      moduleResolution: "node",

      /* Emit */
      removeComments: true,

      /* Interop Constraints */
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,

      /* Type Checking */
      strict: true,
      alwaysStrict: true,
    })
  }
  ```

  ```ts
  // File: user.ts

  class User {
    private username: string
    public readonly email: string

    constructor(username: string, email: string) {
      this.username = username,
      this.email = email
    }

    public hello(): void {
      console.log("Hello")
    }
  }
  ```

  ```ts
  // File: main.ts

  // @bys-import user.ts \\

  const user = new User("carlos", "carlos@gmail.com");
  user.hello();
  ```

  ```ts
  // Result after using bys.
  // File: out/bundle.js

  define(["require", "exports"], function (require, exports) {
    "use strict";
    class User {
        constructor(username, email) {
            this.username = username,
                this.email = email;
        }
        hello() {
            console.log("Hello");
        }
    }
    const user = new User("carlos", "carlos@gmail.com");
    user.hello();
  });
  ```

</details>

## **Contributing**
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## **License**
[MIT](https://choosealicense.com/licenses/mit/)