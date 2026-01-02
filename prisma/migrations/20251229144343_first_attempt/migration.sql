-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "year" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "genreTitle" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenresOnMovies" (
    "movieId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "GenresOnMovies_pkey" PRIMARY KEY ("movieId","genreId")
);

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
