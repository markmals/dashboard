import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { getCollection } from "sprinkles:content";

import type { SortOption } from "~/lib/collections.ts";
import type { CollectionEntry } from "~/lib/content-types.ts";

import { MovieCell } from "~/components/CollectionCells.tsx";
import { CollectionControls } from "~/components/CollectionControls.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import {
    genreControlOptions,
    matchesGenre,
    pickSort,
    resolvePageParams,
    sortControlOptions,
    sortEntries,
    titleKey,
} from "~/lib/collections.ts";

type TheaterData = CollectionEntry<"theaters">["data"];

function releaseTime(release: string): number {
    return new Date(`${release}T00:00:00`).getTime();
}

const THEATER_SORTS = {
    title: { label: "Title (A–Z)", criteria: [d => titleKey(d.title)] },
    "release-asc": { label: "Release (soonest)", criteria: [d => releaseTime(d.release)] },
    "release-desc": { label: "Release (latest)", criteria: [d => -releaseTime(d.release)] },
} satisfies Record<string, SortOption<TheaterData>>;

// How long a title stays under "In Theaters" after release before it ages off the page —
// roughly the typical theatrical window. The data file itself is untouched; the entry just
// stops rendering so the page doesn't feel out of date between manual data refreshes.
const THEATRICAL_RUN_DAYS = 56;

export async function ServerComponent() {
    let params = resolvePageParams();
    let sort = pickSort(THEATER_SORTS, params.get("sort"), "release-asc");
    let genre = params.get("genre") ?? "";

    let movies = await getCollection("theaters");
    let formatter = new Intl.DateTimeFormat("en", { dateStyle: "short" });
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let leftTheaters = new Date(today);
    leftTheaters.setDate(leftTheaters.getDate() - THEATRICAL_RUN_DAYS);

    // Only surface fully-hydrated entries; upcoming titles without a poster on TMDb yet are kept
    // in the data file but hidden until those fields can be filled in.
    let complete = movies.filter(movie => movie.data.poster);
    let visible = complete.filter(movie => matchesGenre(movie.data.genre, genre));

    let inTheaters = sortEntries(
        visible.filter(movie => {
            let release = new Date(`${movie.data.release}T00:00:00`);
            return release <= today && release > leftTheaters;
        }),
        THEATER_SORTS[sort],
    ).map(movie => ({
        ...movie,
        data: {
            ...movie.data,
            release: null as unknown as string,
        },
    }));

    let upcoming = sortEntries(
        visible.filter(movie => new Date(`${movie.data.release}T00:00:00`) > today),
        THEATER_SORTS[sort],
    ).map(movie => ({
        ...movie,
        data: {
            ...movie.data,
            release: formatter.format(new Date(`${movie.data.release}T00:00:00`)),
        },
    }));

    let canReset = sort !== "release-asc" || genre !== "";

    let controls = (
        <CollectionControls
            canReset={canReset}
            controls={[
                {
                    name: "sort",
                    label: "Sort by",
                    value: sort,
                    options: sortControlOptions(THEATER_SORTS),
                },
                {
                    name: "genre",
                    label: "Genre",
                    value: genre,
                    options: genreControlOptions(complete.map(movie => movie.data.genre)),
                },
            ]}
        />
    );

    return (
        <>
            <title>Theater Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                {inTheaters.length > 0 && (
                    <>
                        <SectionHeader actions={controls}>In Theaters</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {inTheaters.map(movie => (
                                <MovieCell key={movie.data.link} movie={movie} />
                            ))}
                        </ul>
                    </>
                )}
                {upcoming.length > 0 && (
                    <>
                        <SectionHeader actions={inTheaters.length === 0 ? controls : undefined}>
                            Upcoming
                        </SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {upcoming.map(movie => (
                                <MovieCell key={movie.data.link} movie={movie} />
                            ))}
                        </ul>
                    </>
                )}
                {inTheaters.length === 0 && upcoming.length === 0 && (
                    <>
                        <SectionHeader actions={controls}>In Theaters</SectionHeader>
                        <EmptyState className="py-12">
                            <EmptyStateIcon>
                                <Icon name="search" size={48} />
                            </EmptyStateIcon>
                            <EmptyStateHeading>No movies match</EmptyStateHeading>
                            <EmptyStateDescription>
                                Try a different genre, or reset the filters.
                            </EmptyStateDescription>
                        </EmptyState>
                    </>
                )}
            </div>
        </>
    );
}
