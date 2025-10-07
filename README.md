# Golden Path webapp template

Template repo for creating a new webapp that walks the golden path.

Usage: [create a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

## TODO

- Auth
- Web unit/integration tests
- E2E tests
- Versioning strategy for prod deploys - automatic changelog & tags
  - Possible solution: version in root package.json and CI-step that checks changelog has matching section
- Add feature flags
- Add better example code for coherent frontend/backend/db
- Expand documentation

## Stack

| Type                   | Description                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| web                    | TS [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) with additions |
| backend                | C# [hexarch template](https://github.com/Arbeidstilsynet/dotnet-templates)                         |
| Infrastructure as Code | [Nais](https://nais.io/)                                                                           |
| Local containers       | Docker Compose                                                                                     |
| Auth                   | Entra ID with OAuth                                                                                |
| Observability          | OpenTelemetry & Grafana                                                                            |

## Workflows

| Name           | Trigger      | Description                                                                                     |
| -------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| CI             | PR           | Build/test/lint pipeline for PRs                                                                |
| Lint PR        | PR           | Adds PR labels and checks PR title                                                              |
| Deploy to Nais | Push to main | Continuous deployment to Nais. Only deploys changed apps and runs e2e tests before prod deploy. |

## Steps after generating new repo

1. Look through all files in [.nais](./.nais) and update for your team and application.
2. Check [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) and remove/update checks that prevent accidental deploys from other repos.
3. Go to GitHub -> repository -> settings -> general. Enable "Allow auto-merge" and "Automatically delete head branches".

> "Allow auto-merge" is particularly useful for Renovate, while "Automatically delete head branches" keeps the branch list clean.

4. After finishing your first PR, go to GitHub -> repository -> settings -> code and automation: rules -> rulesets and create a new ruleset called "CI".
   1. Enforcement status: Active
   1. Target branches -> Add target -> Include default branch
   1. Check "Require status checks to pass" and add checks. Search for "build-backend", "build-web", and "Check PR title". Enable all 3. They should be shown with "GitHub Actions" indicator next to the name.
   1. Save

> PRs that want to merge to main now have to pass the checks from your CI pipeline.

5. Do a global replace all in your IDE for "ExampleBackend" to rename the backend application. Consider renaming `backend/ExampleBackend.sln` as well and make sure the [Dockerfile](./backend/Dockerfile) correctly references the solution.

## Local dev

Start Next.js and C# backend in dev/watch modes with hot reload, with docker compose for DB and Grafana:

```sh
pnpm install && pnpm dev
```

See each `package.json` in root, web and backend for additional commands for running combinations of Docker and dev mode.

## Useful commands

```sh
# use nais cli to validate your manifest and see the result after templating
$: cd .nais
.nais$: nais validate --verbose --vars-file vars-dev.yaml web.yaml
.nais$: nais validate --verbose --vars-file vars-dev.yaml backend.yaml
```

## Specifics to development of goldenpath

### How to upgrade backend template

1. `cd backend`
2. `dotnet new update`
3. Delete all files in backend except [package.json](backend\package.json)
4. `dotnet new hexarch -n "ExampleBackend"`
5. Restore customizations:
   1. Adjust compose files for monorepo structure
   2. Update compose and appsettings files for CORS and web app compatibility
