# automation-testing

> automation-testing project is a front-end focused e2e frameworked cypress autoamtion scripts.

## Prerequisites

This is competible with Mac and Linux.

Please install the following tools before running cypress [`package.json`](./package.json) for the correct version requirements:

[Node](https://nodejs.org)

### Installation

This project uses [Node](https://nodejs.org) to install, run and manage packages. To begin, please install node, and run the following.

```sh
$ npm install
```
To make sure for your node and cypress is installed in your machine

 For Node:
```
node -v
```

For Cypress:
```
./node_modules/.bin/cypress version
```
#### Running tests

The following commands can be used to run tests:

Run cypress test with cypress runner:
```
npm run cypress
```

Run cypress tests in command line:
```
npm run cypress:cli
```

Generate cypress tests HTML report:
```
npm run create:html:report
```