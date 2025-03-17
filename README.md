# OES

## Introduction

This repository is created for `City University of Hong Kong` Final Year Project
All credit goes to: Mark Lai

## List of Component

1. [oes](#oes)
2. [oes-desktop-client](#oes-desktop-client)

## oes

### Pre-requirement

1. Node.js, npm
2. mongoDB

### Setting up db connection

update the local database connection under /server/index.ts

```ts
await mongoose.connect(
  URI.serialize({
    scheme: "mongodb",
    host: "127.0.0.1:27017",
    userinfo: "test:test",
    path: "oes",
    query: "retryWrites=true",
  })
);
```

### Start Local development

1. npm install
2. cp ./.env.default ./.env
3. npm run dev

### Build for production use

1. npm install
2. npm run build
3. npm start

## oes-desktop-client

### Pre-requirement

1. Node.js, npm

### Start Local development

1. npm install
2. npm run dev:react
3. create another terminal install
4. npm run dev:electron

### Build for production use

1. npm install
2. npm run build
