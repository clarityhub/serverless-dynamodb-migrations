# Serverless DynamoDB Migrations

[![Build Status](https://travis-ci.org/clarityhub/serverless-dynamodb-migrations.svg?branch=master)](https://travis-ci.org/clarityhub/serverless-dynamodb-migrations)
[![NPM version](https://badge.fury.io/js/%40clarityhub%2Fserverless-dynamodb-migrations.svg)](https://badge.fury.io/js/%40clarityhub%2Fserverless-dynamodb-migrations)

Database migrations for AWS Lambda and DynamoDB using [DynamoDB Migrations](https://github.com/Floby/node-umzug-dynamodb-storage).

## About

This Serverless plugin can execute and rollback database migrations after deploys. See [Usage](#usage). Forked from [serverless-pg-migrations](https://github.com/clarityhub/serverless-pg-migrations).

> Heavily inspired by [transmogrify](https://github.com/Reckon-Limited/transmogrify). I tried to use it but encountered a lot of showstopping bugs for me, so I wrote my own, smaller and simpler version.

**Notable differences from transmogrify:**

* This plugin does not attempt to add handlers automatically (see [Adding handlers](#adding-handlers))
* This plugin does not create or drop databases
* This plugin does not have a handler for checking database connection

## Migrations

The plugin assumes that migration files live in a `migrations` directory inside your project.

## Installation

`yarn add @clarityhub/serverless-dynamodb-migrations` OR `npm i --save @clarityhub/serverless-dynamodb-migrations`

## Usage

Define a migration handler somewhere in your project. Example:

```js
// /migrations.js

const { up, down } = require("@clarityhub/serverless-dynamodb-migrations/handlers");

module.exports.up = up;

module.exports.down = down;
```

Add the plugin and handlers to your `serverless.yml`:

```yml
provider:
  name: aws

plugins:
  - "@clarityhub/serverless-dynamodb-migrations"

functions:
  up:
    handler: migrations.up
    timeout: 30
    environment:
      MIGRATION_TABLE: migrations
  down:
    handler: migrations.down
    timeout: 30
    environment:
      MIGRATION_TABLE: migrations
```

Pass the function to the serverless deploy command to have it execute after the deploy is finished:

```bash
sls deploy --function up
```

You can also manually invoke the functions locally:

```bash
sls invoke local --function up
```

Or use the plugin directly without going through your function:

```bash
sls migrate up
sls migrate down
```

## Configuration

The provided migration handlers can be imported with `const { up, down} = require("@clarityhub/serverless-dynamodb-migrations/handlers")`.

The functions need to have the environment variable `MIGRATION_TABLE` set to the DynamoDB table name you want to use. If the table doesn't exist, the migrations will create the table for you. You can use [resources](https://serverless-stack.com/chapters/configure-dynamodb-in-serverless.html) to create one if you want though.
