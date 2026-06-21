import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index-redirect.ts"),
    route("activities", "routes/activities.tsx"),
    route("in-theaters", "routes/in-theaters.tsx"),
    route("movies", "routes/movies.tsx"),
    route("recipes", "routes/recipes.tsx"),
    route("restaurants", "routes/restaurants.tsx"),
    route("tv", "routes/tv.tsx"),
] satisfies RouteConfig;
