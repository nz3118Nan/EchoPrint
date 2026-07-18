# EchoPrint Orchestrator Server

FastAPI backend with the Blueprint AI Agent lifecycle pattern:
`main -> lifespan -> container -> migrations -> API routers`.

## Tests

The suite mirrors the Blueprint AI Agent Service layout (`tests/unit`,
`tests/integration`, `tests/fixtures`, `tests/base_test.py`) and is split by
marker:

| Command | Scope |
| --- | --- |
| `poetry run test-unit` | No external services. Always runnable. |
| `poetry run test-integration` | Needs a migrated Postgres. |
| `poetry run test-all` | Both. |

Or invoke pytest directly:

```bash
pytest -m unit                 # 75 tests, no dependencies
pytest -m integration          # needs Postgres
pytest                         # everything
```

### Integration tests

Integration tests resolve their database from `DATABASE_URL`, falling back to
the compose defaults (`localhost:5450`). Bring the database up first:

```bash
docker compose up -d postgres     # from the repo root
pytest -m integration
```

When Postgres is unreachable these tests **skip** rather than fail, so a plain
`pytest` stays green on a machine with nothing running. Upstream fails hard
instead, because it always executes inside docker-compose — the skip is the one
deliberate deviation, and it means a green run does not by itself prove the
integration tests executed. Check for `skipped` in the summary, or run
`pytest -m integration -ra` to see the skip reasons.

### Layout

```
tests/
  base_test.py     BaseAsyncTest — per-test database setup/teardown
  conftest.py      `database` fixture (live Postgres, or skip)
  fixtures/        test data builders and fakes (users, sessions, tokens)
  unit/            mirrors src/ package-for-package
  integration/     mirrors src/ package-for-package
```
