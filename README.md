## Getting Started

Create a `.env` file with the following variables, for example:

```
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/codeboard?schema=public"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_DEBUG_MODE=true
SPACES_KEY=your-access-key
SPACES_SECRET=your-secret-key
SPACES_REGION=tor1
SPACES_BUCKET=codeboard-files
SPACES_ENDPOINT=https://tor1.digitaloceanspaces.com
BETTER_AUTH_SECRET=44C1P97Sia4TzF41wmbdYQsbcwTYXi0d
BETTER_AUTH_URL=http://localhost:3000
```

Run `npm install` to install packages and depedencies.

Create a postgresql database called codeboard that your user can access.
Ensure the postgres service is running, then run the following:

- Open the postgres CLI using `psql postgres`.
- Inside `psql`, run `CREATE DATABASE codeboard;`.
- Modify the `DATABASE_URL` in the `.env` file with the appropriate credentials.

Create a S3 bucket with DigitalOcean Spaces.

- Set the region to `TOR1` and name the bucket `codeboard-files`.
- For ease of setup, do not enable CDN.
- Go to settings and generate an access key for all buckets and with all permissions.
- Modify the `SPACES_KEY` and `SPACES_SECRET` in the `.env` file accordingly.

Generate a secret key for Better Auth, you may use the command `openssl rand -base64 32`.

Run `npx auth@latest generate` to generate Better Auth schemas.

Run `npx prisma migrate dev` to apply SQL migrations.

Run `npx prisma migrate dev` and `npx prisma generate` whenever there was a change to `schema.prisma`

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
