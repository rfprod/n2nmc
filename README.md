# Ng2NodeMongoCore (Ng2NMC)

![build](https://travis-ci.org/rfprod/ng2nmc.svg?branch=master)

## Overview

Ng2NodeMongoCore - application core based on NodeJS, MongoDB and Angular.

### Project structure

* `./app` - server
  * `./app/config` - configurations
  * `./app/models` - db models
  * `./app/routes` - routes
  * `./app/utils` - utilities
* `./public` - client
  * `./public/app` - main module and routes
    * `./public/app/components` - components' scripts (development)
    * `./public/app/modules` - modules' scripts (development)
    * `./public/app/scss` - stylesheets (development)
    * `./public/app/services` - services' scripts (development)
    * `./public/app/views` - components' templates
  * `./public/css/` - bundled styles (production)
  * `./public/img/` - images
  * `./public/js/` - bundled scripts (production)
* `./test` - client/server tests
  * `./test/client` - client tests
  * `./test/e2e` - end to end tests
  * `./test/server` - server tests

# Start

### Requirements

In order to run your own copy of Ng2NMC, you must have the following installed:

- [`Node.js`](https://nodejs.org/)
- [`NPM`](https://nodejs.org/)
- [`MongoDB`](http://www.mongodb.org/)
- [`Git`](https://git-scm.com/)
- [`Heroku CLI`](https://devcenter.heroku.com/articles/heroku-cli)

### Installation & Startup

To install Ng2NMC execute the below command in the terminal window while in your projects folder:

```
git clone https://github.com/rfprod/ng2nmc.git
```

This will install the Ng2NMC components into the `ng2nmc` directory in your projects folder.

### Local Environment Variables

Create a file named `.env` in the root directory. This file should contain:

```
MONGO_FILE_PATH=/path/to/mongo/data/directory
MONGO_URI=mongodb://localhost:27017/ng2nmc
PORT=8080
APP_URL=http://localhost:8080/
MAILER_HOST=smtp.gmail.com
MAILER_PORT=465
MAILER_EMAIL=dummy-sender-email@gmail.com
MAILER_CLIENT_ID=dummy-client-id.apps.googleusercontent.com
MAILER_CLIENT_SECRET=dummy-client-secret
MAILER_REFRESH_TOKEN=dummy-refresh-token
MAILER_RECIPIENT_EMAIL=dummy-recipient-email@gmail.com
```

If `MONGO_FILE_PATH` is not set, database will be created in `~/mongo/`

### Starting the App

To start the app, execute in the terminal while in the project folder (dependencies installation check will be performed before)

```
npm start
```

Now open your browser and type in the address bar

```
http://localhost:8080/
```

Ng2NMC is up and running.

### Testing

#### Server

To test the server execute the following command in the terminal window while in your project's folder when the server is running:

```
$ npm run server-test
```

#### Client Unit

`HeadlessChrome`: in initial configuration for client unit tests to work you will have to export an environment variable for headless Chrome by appending it to `~/.bashrc`, its value should be set to one of the following options, depending on what you have installed: `chromium-browser, chromium, google-chrome`

```
export CHROME_BIN=chromium-browser
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

#### Client E2E

```
$ npm run protractor
```

#### Code Linting

To lint the code execute the following command in the terminal window while in your project's folder:

```
$ npm run lint
```

### Heroku Deployment

*TODO*

#### Heroku deployment: START

*TODO*

## Heroku Documentation

* [`Heroku Devcenter: Gerring started with nodejs`](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* [`Heroku Elements: Addons: Mongolab`](https://elements.heroku.com/addons/mongolab)

## Licenses

* [`Ng2NMC`](LICENSE)
