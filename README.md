# ts-api-boilerplate

Boilerplate for developing an HTTP API in Node.js with TypeScript, Express.js, and TypeORM.

## Development Guide

Prerequisites:
- appropriate `node` version (see the `.nvmrc` file)
- `yarn` (for dependency management and script execution)
- `docker` and `docker-compose` (for running the server, database, and test suite locally in an isolated and reproducible way)

Firstly, always be sure you have installed the latest dependencies, with:
```sh
yarn install
```

To run the test suite in continuous watch mode, use:
```sh
yarn test:watch
```

To run the server in a docker container alongside a database, run:
```sh
yarn docker start
```

The server is reachable at the URL exposed by docker-compose:
```sh
curl -v $(yarn --silent docker:url)/api/v1/status
```

Before the API actions will work correctly, you'll need to first set up the local database (i.e. running migrations):
```sh
yarn docker db:setup
```

If you are making changes to the model definitions, you'll need to make appropriate migrations, which can be assisted using automated tooling to generate the starting migration for you (which you can inspect, verify, and improve as necessary):
```sh
yarn docker db:migration:generate --name AddCoolThings
```

When done inspecting and/or modifying the migration, you can run it (or revert it):
```sh
yarn docker db:migration:run
yarn docker db:migration:revert
```

As the CI suite will fail for any wrongly formatted code, it's recommended to configure your editor to run `prettier` on every save for formatting, but from time to time you may need to run it manually (such as when you generated a migration as above, which will not have the correct formatting by default):
```sh
yarn prettier:write
```
