import type { Route } from "./+types/in-theaters";
import { MovieCell } from "~/components/CollectionCells";
import { SectionHeader } from "~/components/SectionHeader";
import { getCollection } from "~/lib/content.server";
import { releaseSortComparator, titleSortComparator, withContent } from "~/lib/sort-comparators";

export async function loader() {
    const movies = await getCollection("theaters");
    const formatter = new Intl.DateTimeFormat("en", { dateStyle: "short" });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inTheaters = movies.filter(movie => {
        const releaseDate = new Date(`${movie.data.release}T00:00:00`);
        return releaseDate <= today;
    });

    const upcoming = movies.filter(movie => {
        const releaseDate = new Date(`${movie.data.release}T00:00:00`);
        return releaseDate > today;
    });

    return {
        inTheaters: inTheaters
            .toSorted(withContent(titleSortComparator))
            .map(movie => ({
                ...movie,
                data: {
                    ...movie.data,
                    release: null as unknown as string,
                },
            })),
        upcoming: upcoming
            .toSorted(withContent(releaseSortComparator))
            .map(movie => ({
                ...movie,
                data: {
                    ...movie.data,
                    release: formatter.format(new Date(`${movie.data.release}T00:00:00`)),
                },
            })),
    };
}

export default function Component({ loaderData }: Route.ComponentProps) {
    const { inTheaters, upcoming } = loaderData;
    return (
        <>
            <title>Theater Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                <SectionHeader>In Theaters</SectionHeader>
                <ul
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
                    role="list"
                >
                    {inTheaters.map(movie => <MovieCell key={movie.id} movie={movie} />)}
                </ul>
                <SectionHeader>Upcoming</SectionHeader>
                <ul
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
                    role="list"
                >
                    {upcoming.map(movie => <MovieCell key={movie.id} movie={movie} />)}
                </ul>
            </div>
        </>
    );
}
