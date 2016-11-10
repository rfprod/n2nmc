# Ng2NodeMongoCore (N2NMC)

## Overview

Ng2NodeMongoCore - application core based on NodeJS, MongoDB and Angular2.

### Project structure

* `./app` - server
  * `./app/config` - configurations
  * `./app/models` - db models
  * `./app/routes` - routes
  * `./app/utils` - utilities
* `./public` - client
  * `./public/app` - main module and routes
    * `./public/app/components` - components' scripts (development)
    * `./public/app/scss` - stylesheets (development)
    * `./public/app/services` - services' scripts (development)
    * `./public/app/views` - components' templates
  * `./public/css/` - bundled styles (production)
  * `./public/img/` - images
  * `./public/js/` - bubdled scripts (production)
* `./test` - client/server tests
  * `./test/client` - client tests
  * `./test/e2e` - end to end tests
  * `./test/server` - server tests

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
MONGO_URI=mongodb://localhost:27017/n2nmc
PORT=8080
APP_URL=http://localhost:8080/
```

#### Openshift deployment requires env variables setup via rhc

for example

`rhc env set -a n2nm -e APP_URL=https://n2nmc-ecapseman.rhcloud.com/`

required vars

```
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

N2NMC is up and running.

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
