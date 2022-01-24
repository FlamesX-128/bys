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

- **output-dirname**
  + This flag specifies the name of the folder where the file will be added.
  + If not added, the file is placed in the directory where it was called bys.
  + Usage: `$ bys --output-dirname="main.js"`
  + Optional flag.

- **output-filename**
  + This flag specifies what is the name of the file created by bys.
  + If not added, the default name is "bundle".
  + Usage: `$ bys --output-filename="bundle.js"`
  + Optional flag.

### **Configuration file**
You can create a configuration file for bys called `bys.config.json` with the following structure:

```json
{
  "entry": "",
  "output": {
    "dirname": "",
    "filename": ""
  }
}
```

### **Example**
Here are some examples of using bys with js and ts.

Using JavaScript (JS)
```js
// File: sum.js

function sum(x, y) {
  return x + y;
}
```
```js
// File: main.js

// @bys-import ./sum.js \\
console.log(sum(1, 3))
```

Result after using bys:
```js
// File: bundle.js
function sum(x, y) {
  return x + y;
}
console.log(sum(1, 3))
```

---

Using TypeScript (TS)
```ts
// File: pong.ts

function pong() {
  return "Pong!";
}
```
```ts
// File: main.ts

// @bys-import ./pong.ts \\
console.log(pong())
```

Result after using bys:
```ts
// File: bundle.ts
function pong() {
  return "Pong!";
}
console.log(pong())
```

## **Contributing**
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## **License**
[MIT](https://choosealicense.com/licenses/mit/)