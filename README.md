# Ng2NodeMongoCore (N2NMC)

## Overview

Ng2NodeMongoCore - application core based on NodeJS, MongoDB and Angular2.

### Integrations

* [`Twitter`](https://twitter.com/)

# Start

### Requirements

In order to run your own copy of N2NMC, you must have the following installed:

- [`Node.js`](https://nodejs.org/)
- [`NPM`](https://nodejs.org/)
- [`MongoDB`](http://www.mongodb.org/)
- [`Git`](https://git-scm.com/)

### Installation & Startup

To install N2NMC execute the below command in the terminal window while in your projects folder:

```
git clone https://github.com/rfprod/n2nmc.git
```

This will install the N2NMC components into the `n2nmc` directory in your projects folder.

### Local Environment Variables

Create a file named `.env` in the root directory. This file should contain:

```
TWITTER_KEY=twitter-key
TWITTER_SECRET=twitter-secret
MONGO_URI=mongodb://localhost:27017/n2nmc
PORT=8080
APP_URL=http://localhost:8080/
```

#### Openshift deployment requires env variables setup via rhc

for example

`rhc env set -a n2nm -e APP_URL=https://n2nmc-ecapseman.rhcloud.com/`

required vars

```
TWITTER_KEY=twitter-key
TWITTER_SECRET=twitter-secret
APP_URL=application-url
MONGO_USR=database-user-name
MONGO_PASS=database-user-password
```

### Starting the App

To start the app, execute in the terminal while in the project folder (dependencies installation check will be performed before)

```
npm start
```

Now open your browser and type in the address bar

```
http://localhost:8080/
```

SPAMT is up and running.

### Testing

To test the server execute the following command in the terminal window while in your project's folder when the server is running:

```
$ npm run server-test
```

To test the client execute the following command in the terminal window while in your project's folder:

for continuous testing

```
$ npm run client-test
```

for single test

```
$ npm run client-test-single-run
```

To lint the code execute the following command in the terminal window while in your project's folder:

```
$ npm run lint
```

### The OpenShift cartridges documentation

* [`cartridge guide`](https://github.com/openshift/origin-server/blob/master/documentation/oo_cartridge_guide.adoc#openshift-origin-cartridge-guide)
* [`cartridge guide: mongodb`](https://github.com/openshift/origin-server/blob/master/documentation/oo_cartridge_guide.adoc#9-mongodb)
* [`cartridge guide: nodejs`](https://github.com/openshift/origin-server/blob/master/documentation/oo_cartridge_guide.adoc#11-nodejs)

## Licenses

* [`N2NMC`](LICENSE.md)
