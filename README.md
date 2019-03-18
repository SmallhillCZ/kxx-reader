# Transform stream to parse Gordic KXX export

## Prerequisities
 - NodeJS
 
## Installation

```bash
npm i kxx-reader
```

## Usage

### Pipe data
```typescript

const KXXReader = require("kxx-reader");

fs.createReadStream("./export.kxx")
  .pipe( KXXReader() )
  .pipe( /* consume JSON records */ ) 
  
```

### Write directly

```typescript
const KXXReader = require("kxx-reader");

const kxxreader = KXXReader();

kxxreader.on("data", record => {
  /* consume JSON records */
});

kxxreader.write("5/@.....");
kxxreader.end();
```
