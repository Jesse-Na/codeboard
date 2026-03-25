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
```

Run `npm install`.

Create a postgresql database called codeboard that your user can access.

Run `npx prisma migrate dev --name init`.

- Run `npx prisma migrate dev` and `npx prisma generate` whenever there was a change to `schema.prisma`

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
