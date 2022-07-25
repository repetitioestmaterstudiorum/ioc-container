# ioc-container

## Dependency Injection Container

This is app contains a minimal DI container solution, which allows for inversion of control -> that objects don't instantiate instances of other objects they rely on. The instantiation of objects happens in one place, from whith these instances are provided using the container to wherever they are needed throughout the code base.

https://www.codequality.rocks/post/use-dependency-injection

## Config paradigm

This app also contains a configuration paradigm that allows for a default config in the code (inside the Config object), and the option to overwrite each config element in the database. This is a simple yet powerful way to change an application's configuration during runtime without changing the code. It also ensures a default configuration, in case the database does not contain the desired configuration key.

## CustomCollection class (MondoDB)

Last but not least, this app contains a custom mongo db class that utilizes the CustomCollection class. This class is a simplification of mongo db's default nodejs driver collection methods. It also adds basic fields like updatedAt and createdAt automatically. It inserts documents with the stringified version of Mongo's ObjectIds by default.

## Development

-   create a .env file for your secrets: `touch .env` (if secretes are needed)
-   run `npm run dev`
-   test with `npm test` or `npm run test:full` if you're feeling like a hero

## Deployment

-   there's a docker-compose file that will build an environment (using the Dockerfile) and the app (using the npm build script) and start the application with pm2 in no-daemon mode
-   theoretically, this could be deployed somewhere without much adaptation (fly.io, Heroku, ...)

## pm2 usage

In production, pm2 is used to start (and restart in case of a crash) the built app. The configuration is kept to a minimum. There is a pm2 npm script that enables running pm2 commands, such as `npm run pm2 list` or `npm run pm2 monit` without installing pm2 globally.

If you'd like to see your app on `app.pm2.io`, you can set the environment variables PM2_PUBLIC_KEY and PM2_SECRET_KEY (typically, in production only).

Logging: by default, pm2 is configured not to save log files (so you don't need to rotate or delete them). The log file directory for stdout and stderr can be adjusted by changing the CLI options `-o '/dev/null' -e '/dev/null'` in the npm start script to something that exists.
