FROM python:3.12-slim

WORKDIR /app
ENV POETRY_VIRTUALENVS_CREATE=false
RUN pip install --no-cache-dir poetry
COPY pyproject.toml README.md ./
RUN poetry install --only main --no-root
COPY src ./src

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
