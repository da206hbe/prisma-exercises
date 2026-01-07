-- DropForeignKey
ALTER TABLE "GenresOnMovies" DROP CONSTRAINT "GenresOnMovies_genreId_fkey";

-- DropForeignKey
ALTER TABLE "GenresOnMovies" DROP CONSTRAINT "GenresOnMovies_movieId_fkey";

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
