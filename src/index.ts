// Start by installing the project with `npm install`
// Set your connection string in the `.env` file
// Set up your schema.prisma file
// Generate the client with `npx prisma generate`
// Update the database with with `npx prisma migrate dev`
// Run the app with `npm run start`

import { input, select } from "@inquirer/prompts";
import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { connect } from "http2";

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
  throw new Error('Could not find "DATABASE_URL" in your .env file');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function addMovie(): Promise<void> {
  // Expected:
  // 1. Prompt the user for movie title, year. x
  // 2. Use Prisma client to create a new movie with the provided details. x
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  // 3. Print the created movie details. x
  //
  // Transactions and relationships (This we can add later on)
  //    Reference : https://www.prisma.io/docs/orm/prisma-client/queries/transactions
  // Expected:
  // 1.b Prompt the user for genre.
  // 2.b If the genre does not exist, create a new genre.
  // 3.b Ask the user if they want to want to add another genre to the movie.

  // Basic data for movie
  const movieTitle: string = await input({message: 'Enter movie title: '});
  const details: string = await input({message: 'Enter movie details: '});
  const createdYear: string = await input({message: 'Enter year of creation: '});
  let genreTitle: string = "";
  let anotherAnswer: string = "";
  const genres: string[] = [];

  // Collect genres in an array
  do {
    genreTitle = await input({message: 'Enter a genre: '});

    genres.push(genreTitle.trim());

    anotherAnswer = await input({message: 'Do you want to enter another genre (y/n): '});
  } while (anotherAnswer.toLowerCase() === 'y');

  // Look if genre already exists otherwise create it
  const genreConnections = [];

  for (const genreTitle of genres) {
    let genre = await prisma.genre.findFirst({
      where: {
        genreTitle
      }
    });

    if (!genre)
      genre = await prisma.genre.create({
        data: { genreTitle }
      });

    genreConnections.push({
      genre: {
        connect: {
          id: genre.id
        }
      }
    });
  }
  
  // Create the film and connect genres
  const movie = await prisma.movie.create({
    data: {
      title:    movieTitle,
      details:  details,
      year:     createdYear,
      genres: {
        create: genreConnections
      }
    },
    include: {
      genres: {
        include: { genre: true }
      }
    }
  });

  console.log(`\n${movie.title}\n${movie.details}\n${movie.year}\n`);

  for (const genreOnMovies of movie.genres)
    console.log(`${genreOnMovies.genre.genreTitle} `);

  console.log(`\n`);
}

async function updateMovie(): Promise<void> {
  // Expected:
  // 1. Prompt the user for movie ID to update.
  // 2. Prompt the user for new movie title, year.
  // 3. Use Prisma client to update the movie with the provided ID with the new details.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
  // 4. Print the updated movie details.

  // Fetch all the movie titles
  const movies = await prisma.movie.findMany({
    orderBy: { title: "asc" }
  });

  // Build choices for the select menu
  const choices = movies.map(movie => ({
    name: `${movie.title} (${movie.year})`,
    value: movie.id
  }));

  // Choose a movie
  const movieId = await select({
    message: 'Choose what movie to update',
    choices
  });

// Fetch the one to update
const movie = await prisma.movie.findUnique({
  where: { id: movieId }
});

console.log(`\nMovie to update: ${movie?.title}\nCreated year: ${movie?.year}`);

// 


  // Fill select with movie titles
  // const movieSelect = await select ({
  //   message: 'Select movie to update',
  //   choices: [ {
  //     name: 'npm',
  //     value: 'npm',
  //     description: 'npm is shit'
  //   },
  //   {
  //     name: 'vpm',
  //     value: 'vpm',
  //     description: 'vpm is crap'
  //   } ]
  // });
}

async function deleteMovie(): Promise<void> {
  // Expected:
  // 1. Prompt the user for movie ID to delete.
  // 2. Use Prisma client to delete the movie with the provided ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
  // 3. Print a message confirming the movie deletion.
}

async function listMovies(): Promise<void> {
  // Expected:
  // 1. Use Prisma client to fetch all movies.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 2. Include the genre details in the fetched movies.
  // 3. Print the list of movies with their genres (take 10).
}

async function listMovieById(): Promise<void> {
  // Expected:
  // 1. Prompt the user for movie ID to list.
  // 2. Use Prisma client to fetch the movie with the provided ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
  // 3. Include the genre details in the fetched movie.
  // 4. Print the movie details with its genre.
}

async function listMovieByGenre(): Promise<void> {
  // Expected:
  // 1. Prompt the user for genre Name to list movies.
  // 2. Use Prisma client to fetch movies with the provided genre ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 3. Include the genre details in the fetched movies.
  // 4. Print the list of movies with the provided genre (take 10).
}

async function addGenre(): Promise<void> {
  // Expected:
  // 1. Prompt the user for genre name.
  // 2. Use Prisma client to create a new genre with the provided name.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  // 3. Print the created genre details.
}

async function exitProgram(): Promise<never> {
  await prisma.$disconnect();
  process.exit(0);
}

const choices = [
  { name: "Add movie", value: addMovie },
  { name: "Update movie", value: updateMovie },
  { name: "Delete movie", value: deleteMovie },
  { name: "List all movies", value: listMovies },
  { name: "Get movie by ID", value: listMovieById },
  { name: "Get movies by Genre", value: listMovieByGenre },
  { name: "Add genre", value: addGenre },
  { name: "Exit", value: exitProgram },
] as const;

while (true) {
  try {
    console.clear();

    const action = await select({
      message: "Select an action:",
      choices: choices,
      loop: false,
    });

    await action();
  } catch (error) {
    console.error("An error occurred:", error);
    console.log("Please try again.");
  } finally {
    console.log();
    void (await input({
      message: "Press Enter to continue...",
      theme: {
        prefix: "",
      },
    }));
  }
}
