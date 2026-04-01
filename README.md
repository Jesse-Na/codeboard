# Codeboard
### Team Information
Nilofer Hyder — 1007273807 — nilofer.hyder@mail.utoronto.ca
Jesse Na — 1005890788 — jesse.na@mail.utoronto.ca
Taniya Peterratnaraj — 1003004438 — taniya.peterratnaraj@mail.utoronto.ca
Catherine Zhu — 1006780592 — czhu233@gmail.com

## Video Demo

## Motivation
Computer Science and Engineering education currently lacks software tools that suit the needs of educators. Teachers typically use a mix of slides (e.g. Powerpoint, Quarto), live code-alongs, or notetaking apps (e.g Notability, One Note), because each tool on its own is not sufficient. Slides provide a structured and shareable way to introduce concepts and present code, but lack the flexibility to adapt the code to questions. Live code-alongs offer the greatest flexibility, allowing students and teachers to test ideas and develop understanding together, but lack structure and shareability. Notetaking apps offer the structure of slides and the flexibility of live coding, but has no support for code. 

These clumsy setups result in significant additional lecture prep time, material exists and is repeated between multiple tools, and a worse experience for teachers and students alike. Programming is difficult to learn already, especially with low-level languages like C or Rust, and our educational tools do not need to make the process harder. We envision an alternative computer education experience, where code can sit alongside memory model diagrams and handwritten annotations all within a structured and shareable space. 

## Objectives
Our goal was to create a workspace that would aid in the presentation of code and ideas simultaneously. We built an application that allows users to create and host rooms that other users can join. Each room features a real-time code editor and a whiteboard, allowing educators to both write code and draw visual aids on the side. We wanted to make the experience as smooth and lightweight as possible, so that users could spin up a room and get to teaching on a platform that just works.

## Technical Stack (Catherine)
>Describe the technologies used, including the chosen approach (Next.js Full-Stack or Express.js Backend), database solution, and other key technologies.

CodeBoard is a *Next.js* full-stack web application that uses *Typescript* for both the frontend and backend code for type safety. UI elements for the frontend is implemented using both *Next.js* and *React*, and styled with *Tailwind CSS*. *shadcn/ui* is also used to ensure a clean, modern look of the application.

The backend includes Next.js server actions, GET API routes, Socket.io endpoints for real-time whiteboards and code editors, and server-side-rendered components. Images and code files created by the user is stored in a bucket provided by DigitalOcean spaces. Rooms and their records, along with users are stored in a local Postgres database. Prisma ORM is used to for database interactions and to generate types for the application to use.

## Features

### Dashboard / Landing Page / General UI
The overall UI of the application uses *shadcn/ui* and *Tailwind CSS* to ensure consistency and responsiveness throughout each page, while meeting the frontend requirements of ths project. 

Upon entering the site, users are greeted by the landing page where users can sign up or sign in, or navigate to the dashboard directly. 

The dashboard serves as the main page of the application, where authenticated users can create or join rooms, known as workspaces. These workspaces are displayed as a grid in the form of cards. Users can also view their own workspaces or any files saved during the room session by navigating to the *My Workspace* or *My Files* tab on the sidebar, respectively. Buttons are conveniently located on the header of the dashboard or as a card itself to allow users to create their own workspace.

### User Accounts
User authentication is one of the advanced features implemented for this project. Better Auth was implemented to ensure only authenticated users are able to access the website's feature. Users can create an account or log in with an existing account through their email and password. Once successfully authenticated, a secure session will be established using cookies. Frontend routes such as user account page and workspace editors will be protected by verifying the authentication state from `AuthContext` and `AuthProvider` before displaying content. All backend API endpoints will also require a valid authenticated session before returning any data. User passwords will be securely hashed and salted via Better Auth.

### Rooms
A room is a space users can connect and interact with a live code editor and whiteboard. Each room has a unique identifier stored inside our database and sits on the API route `/rooms/[id]`. Additionally, a list of all available rooms can be fetched with a GET request to the API endpoint `/rooms`.

Room creation starts with a *shadcn/ui* dialog popup containing a form for room details. Once submitted, a Next.js server action is invoked to create a record of the room in the database, the user is then redirected to a room and a socket connection is established with the backend for both the code editor and whiteboard. The backend contains an array of all live rooms and its purpose is to receive messages from clients and broadcast those messages to other users in the respective room.

#### Whiteboard
The whiteboard is one of our core features and features a live update canvas that users can draw on using a pen that can change colour and stroke size, and erase or clear. The whiteboard and its accompanying toolbar are React components made using a variety of HTML elements (e.g. div, canvas) and *shadcn/ui* components (e.g. Slider, Input, Button) all styled with Tailwind CSS classes. Typescript is heavily featured when passing props from Whiteboard to WhiteboardTools, for restricting the possible Tool options, and when interacting with socket channels.

The whiteboard can also be saved, which invokes a sequence of crucial steps in the backend, starting with a Next.js server action. The action verifies the room exists in the database, then makes a `PutObjectCommand` call to our *DigitalOcean* bucket storage with a `.png` representation of the whiteboard. We make another database call to save the storage key for easy access when retrieving files.

#### Code Editor
The other main feature of our application is the live updating code editor, which is implemented with the *CodeMirror* component. The code editor component uses built in extensions to highlight the syntax associated with the selected language for ease of understanding.

The code editor also has an associated toolbar to aid a user with some useful features. The toolbar takes a set of typesafe props passed from the code editor (i.e. fileInputRef: RefObject<HTMLInputElement | null>) to keep the code editor in sync with the toolbar. The toolbar consists of several *shadcn/ui* components including *Select* for the language selection, *Input* for text size updates, and *Buttons* for text size updates, upload, download and save.

The code editor can be saved by calling a created *Next.js action*. Similar to the whiteboard action, the action confirms that a room exists in the database before making a new `PutObjectCommand` to our *DigitalOcean* bucket. Then one final call is made to the database to save the storage key.

### Files
talk about:
- retrieving code and whiteboard images from old rooms
- database
- actions

The files page consists of a table with the following columns:
- Record ID, row ID for the table
- Room, the name of the workspace where the file was saved from
- Code File, download button for the downlodable file if available
- Image File, download button containing the downloadbale file if available
- Last Updated, timestamp for when it was last updated

- moving this here for now, delete if it's not needed :3


## User Guide

### Feature: Landing Page and Dashboard (Catherine)

#### Landing Page
On the landing page, users can do the following:
- Click **Sign Up** to log into the dashboard
- Click **Dashboard** to enter the main page
- Click **Join a Room** to directly join a workspace

<img width="1915" height="598" alt="image" src="https://github.com/user-attachments/assets/f4cc6eae-799a-42e1-89d4-0dfab6c35e4f" />

Unauthenticated users that attempt to enter the dashboard are directed to the sign in or sign up page where they can login or create an account using their emails. 

#### Dashboard
The main page contains a collapsable navigation bar with the following tabs:
- Dashboard
- My Rooms
- My Files

The dashboard page consists of current rooms displayed in the form of cards. Each card details the name of the room, creator, and an optional description. The *My Rooms* page only displays the rooms created by the user. The *My Files* page lists any saved files from the room sessions. At the bottom of the navigation bar, users can choose to log out from their accounts.

<img width="1887" height="1071" alt="image" src="https://github.com/user-attachments/assets/bc92c249-d1da-460f-9d1f-882a70f01632" />

### Feature: User Accounts
Users can create an account or sign in using their emails. During signup, users are also prompted to enter a display name.

|Sign In|Sign Up|
|----------|:-------------:|
|<img width="553" height="679" alt="image" src="https://github.com/user-attachments/assets/22b47a5e-d00e-471c-9ac8-0958c3c0f55c" />|<img width="557" height="632" alt="image" src="https://github.com/user-attachments/assets/ae53b4a2-b914-4b4e-b84f-958bb01e804c" />|

### Feature: Rooms
To create a room, click the **Create New Room** button on the dashboard or in the top-right header. Enter a name for the room, and select a programming language. A description is optional. Press **Create Room** to be redirected to your new room.

<img width="371" height="373" alt="image" src="https://github.com/user-attachments/assets/73ebf9e4-d61b-455e-8380-fdb3e019d007" />

To delete or edit the name, language, or description of the room, navigate to *My Workspace* and right-click on the room card. A menu will appear with the options to edit or permanently delete the room.

<img width="486" height="235" alt="image" src="https://github.com/user-attachments/assets/8e32e7c1-20d6-4dec-8a7d-0f2b70f76a35" />

The room page consists of a code editor, a whiteboard and a toolbar associated with each feature. The "Leave Room" button on the upper right corner redirects the user back to the Dashboard page.

<img width="1623" height="669" alt="image" src="https://github.com/user-attachments/assets/78759cac-2f4f-4322-8291-5b27e3c5d94a" />

#### Code Editor
Using the toolbar, users can switch programming languages to change syntax, or increase text size.

Users can upload an existing code file from their computer using the **Upload Code** button, or write code directly in the editor. To save the edited code file locally, press **Download Code**. Click the **Save** icon to save the file in the application.
 
<img width="805" height="744" alt="image" src="https://github.com/user-attachments/assets/e313fa31-4e7f-4c56-a07b-4494b94920dd" />

#### Whiteboard
Using the toolbar, users can adjust the line width or colour. To draw, select the pencil icon under the tools section, or erase by selecting the eraser icon. To delete all drawings, click the trash icon. The hand tool allows the user to select text.

To save the image in the application, click the **Save** icon.

<img width="798" height="345" alt="image" src="https://github.com/user-attachments/assets/3d765988-7507-4ade-a7ab-0135625e922d" />

### Feature: Files
Drawings and code saved from each room session are accessible in the *My Files* page.
Press the **Download** button to download the file onto your computer.

<img width="1623" height="275" alt="image" src="https://github.com/user-attachments/assets/87fe88b0-247c-44f2-8b68-4ad9862b1c8c" />

## Development Guide (Jess)

### Prerequisites

Ensure you have at least Node.js v22.x installed.

### Environment Setup and Configuration

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

#### Database Initialization
Create a postgresql database called codeboard that your user can access.
Ensure the postgres service is running, then run the following:

- Open the postgres CLI using `psql postgres`.
- Inside `psql`, run `CREATE DATABASE codeboard;`.
- Modify the `DATABASE_URL` in the `.env` file with the appropriate credentials.

#### Cloud Storage Configuration
Create a S3 bucket with DigitalOcean Spaces.

- Set the region to `TOR1` and name the bucket `codeboard-files`.
- For ease of setup, do not enable CDN.
- Go to settings and generate an access key for all buckets and with all permissions.
- Modify the `SPACES_KEY` and `SPACES_SECRET` in the `.env` file accordingly.

#### BetterAuth
Generate a secret key for Better Auth, you may use the command `openssl rand -base64 32`.

### Local Development and Testing
For first-time set up or whenever you make a change to `schema.prisma`, run the following:

Run `npx auth@latest generate` to generate Better Auth schemas.

Run `npx prisma migrate dev` to apply SQL migrations.

Run `npx prisma generate` 

Start the development server for testing `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment Information
>Provide the live URL of your application and relevant deployment platform details.


## AI Assistance & Verification (Summary)
If AI tools contributed to your project, provide a concise, high-level summary demonstrating that your team:

    Understands where and why AI tools were used
    Can evaluate AI output critically
    Verified correctness through technical means

Specifically, briefly address:

    Where AI meaningfully contributed (e.g.,architecture exploration, database queries, debugging, documentation)
    One representative mistake or limitation in AI output (details should be documented in ai-session.md)
    How correctness was verified (e.g., manual testing of user flows, logs, unit or integration tests)

Do not repeat full AI prompts or responses here. Instead, reference your ai-session.md file for concrete examples.

## Individual Contributions

### Jess

### Nilofer

### Catherine

### Taniya

## Lessons Learned and Concluding Remarks
Our goal of creating a workspace to aid in the simultaneous presentation of code and ideas was overall successfull. Users are able to use both the code editor and whiteboard in rooms that can be created and joined by other users. 

            - lessons learned
                - Check ins are important
                - Next.js was useful
                - Better Auth was great for user authentication
                - Time constraints
                - 
