# Personal Dashboard

A little personal dashboard application to keep track of TV shows & movies I want to watch, movies in theaters I want to go see, activities I want to do, restaurants I want to eat at, and recipes I want to cook.

## Adding recipes

Export recipes from [Mela](https://mela.recipes), then run `mise run recipes:import <path>...` with any mix of `.melarecipe` files, `.melarecipes` archives, and folders of them. Each recipe lands in `app/content/recipes/<slug>.json` with its photo in `public/recipes/`, and is served at `/recipes/<slug>`. The import picks each recipe's main ingredients with Claude Sonnet 5 through the OMP SDK, so it runs under Bun and needs an Anthropic login in `omp`.
