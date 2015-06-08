# Screenbeacon node.js bindings [![Build Status](https://travis-ci.org/screenbeacon/screenbeacon-node.png?branch=master)](https://travis-ci.org/screenbeacon/screenbeacon-node)

IN ACTIVE DEVELOPMENT. NOT PRODUCTION READY.

## Installation

`npm install screenbeacon`

## Documentation

Documentation is available at https://screenbeacon.readme.io.

## API Overview

Every resource is accessed via your `screenbeacon` instance:

```js
var screenbeacon = require('screenbeacon')('API_ID', 'API_TOKEN');
// screenbeacon.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource method accepts an optional callback as the last argument:

```js
screenbeacon.projects.create(
  { name: 'New Project' },
  function(err, project) {
    err; // null if no error occurred
    project; // the created project object
  }
);
```

Additionally, every resource method returns a promise, so you don't have to use the regular callback. E.g.

```js
// Create a new project and then a new charge for that project:
screenbeacon.projects.create({
  name: 'New Project'
}).then(function(project) {
  return screenbeacon.tests.create({
    name: 'New Test',
    beaconscript: 'width 1280\nvisit "https://www.screenbeacon.com"',
    project_id: project.id
  });
}).then(function(test) {
  // New test created on a new project
}, function(err) {
  // Deal with an error
});
```

## Configuration

 * `screenbeacon.setApiId('API_ID');`
 * `screenbeacon.setApiToken('API_TOKEN');`
 * `screenbeacon.setTimeout(20000); // in ms` (default is node's default: `120000ms`)

## Development

To run the tests you'll need a Screenbeacon *Test* API key (from your [Screenbeacon Dashboard](https://www.screenbeacon.com/dashboard/settings)):

```bash
$ npm install -g mocha
$ npm test
```
