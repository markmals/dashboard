import { MovieCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { releaseSortComparator, titleSortComparator, withContent } from "~/lib/sort-comparators.ts";
import type { Route } from "./+types/in-theaters";

export async function loader() {
    const movies = await getCollection("theaters");
    const formatter = new Intl.DateTimeFormat("en", { dateStyle: "short" });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only surface fully-hydrated entries; upcoming titles without a trailer or poster on
    // TMDb yet are kept in the data file but hidden until those fields can be filled in.
    const complete = movies.filter(movie => movie.data.poster);

    const inTheaters = complete
        .filter(movie => {
            const releaseDate = new Date(`${movie.data.release}T00:00:00`);
            return releaseDate <= today;
        })
        .toSorted(withContent(titleSortComparator))
        .map(movie => ({
            ...movie,
            data: {
                ...movie.data,
                release: null as unknown as string,
            },
        }));

    const upcoming = complete
        .filter(movie => {
            const releaseDate = new Date(`${movie.data.release}T00:00:00`);
            return releaseDate > today;
        })
        .toSorted(withContent(releaseSortComparator))
        .map(movie => ({
            ...movie,
            data: {
                ...movie.data,
                release: formatter.format(new Date(`${movie.data.release}T00:00:00`)),
            },
        }));

    return {
        inTheaters,
        upcoming,
    };
}

export default function Component({ loaderData }: Route.ComponentProps) {
    const { inTheaters, upcoming } = loaderData;
    return (
        <>
            <title>Theater Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                {Boolean(inTheaters.length) && (
                    <>
                        <SectionHeader>In Theaters</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {inTheaters.map(movie => (
                                <MovieCell key={movie.data.link} movie={movie} />
                            ))}
                        </ul>
                    </>
                )}
                {Boolean(upcoming.length) && (
                    <>
                        <SectionHeader>Upcoming</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {upcoming.map(movie => (
                                <MovieCell key={movie.data.link} movie={movie} />
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}
