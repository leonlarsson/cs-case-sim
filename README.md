# Counter-Strike Case Simulator

A toy project to simulate opening cases in Counter-Strike. Built with Next.js, Tailwind, PostgreSQL, Drizzle ORM, and TypeScript.

## To run locally:

1. Clone repo
2. Run in dev provided dev container
3. Run `npm install`
4. Run `npm run db:sync` to create the database structure
5. Run `npm run db:seed` to seed the database
6. Run `npm run dev` to start the server
7. Browse to http://localhost:3000
8. To import/manipulate the database, the `npm run db:studio` launches Drizzle Studio on https://local.drizzle.studio

## To deploy (to Coolify - assuming a project already exists):

1. Create Postgres database resource (postgres:16-alpine)
2. Ensure the Next.js is also a resource in the same project (deploy using /Dockerfile)
3. Create the `DATABASE_URL` environment variable in the Next.js resource (The PG resource will have it ready to copy)
4. Make sure both the Next.js and DB resources are deployed
5. Next.js app: Use the Coolify terminal to run `npm run db:sync` and `npm run db:seed`
6. The app should now be running
7. To import data, run the following command from Windows: `type path/to/data.sql | ssh root@<IP> "docker exec -i <running PG container id> psql -U postgres -d case_sim"`
