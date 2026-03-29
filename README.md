## Getting Started

Create a `.env` file with two variables, for example:

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

Please change the BETTER_AUTH_SECRET to your own. You can use `openssl rand -base64 32` to generate one.

Run `npm install`.

Create a postgresql database called codeboard that your user can access, and replace the
DATABASE_URL accordingly.

Run `npx auth@latest generate` to generate Better Auth schemas.

Run `npx prisma migrate dev --name init` to apply SQL migrations.

- Run `npx prisma migrate dev` and `npx prisma generate` whenever there was a change to `schema.prisma`

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
