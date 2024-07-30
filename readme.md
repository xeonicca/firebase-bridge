# Firebase bridge
default url: [https://at-marker-extension-dev.web.app/](https://at-marker-extension-dev.web.app/)

## Setup

Install necessary modules by using pnpm
```
pnpm install
```

Build project
```
pnpm build
```

## Deploy

Install firebase tools

Log in firebase via CLI
```
firebase login
```

Once logged in, you can now run deploy command
```
firebase deploy
```

## Code explain
### authHandler.js
Where auth magic happens

### dataHandler.js
Handle firestore read/write

### storageHandler.js
Handle cloud storage read/write