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

## PlanetScale migration plan (already done):

### PlanetScale

1. Run `npm run db:delete-old-non-coverts` on production data
2. Create a dev branch and seed it with production data
3. Remove any unused columns (except `item_name` for now)
4. Add a new column `is_stat_trak` to the `case_sim_items` table
5. If `item_name` contains "StatTrak", set `is_stat_trak` to `TRUE`
6. Remove the `item_name` column
7. Use the PlanetScale CLI to dump the dev branch
8. Take note of the current amount of unboxes / covert unboxes (`max(id)` and `count(*)` respectively)
9. Do a bunch of find and replaces such as 0 -> false, 1 -> true

### Data import

1. Dev: Import .sql file(s) by running `type data.sql | docker exec -i db psql -U postgres -d case_sim`
2. Prod: Import .sql file(s) using the following command from Windows: `type data.sql | ssh root@<IP> "docker exec -i <running PG container id> psql -U postgres -d case_sim"`. This will SSH into my VPS, exec into the running PG container, and run the psql command to import the data
3. Both: Set the values in the `settings` table with the total amount of unboxes and covert unboxes as noted earlier

### Run Drizzle Studio locally against production DB

1. Locally: Run `ssh -L 5432:<postgres_ip>:5432 root@<VPS_ip>`. This will open a tunnel to the VPS that you can run the next commands on
2. Get the Postgres IP by running the following: `docker ps` -> grab the Posgres container ID -> `docker inspect <container_id> | grep "IPAddress"`
3. Copy the Postgres URL from the Coolify resource and use that as the `DATABASE_URL`, but replace the host with `localhost:5432`
4. Run `npm run db:studio` to open Drizzle Studio against the production DB
