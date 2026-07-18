#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Runner Scripts

Ported from the Blueprint AI Agent Service (scripts/ops/tests.py). Upstream
shells into the `blueagent` container via docker-compose exec; EchoPrint's
suite runs on the host, so pytest is invoked directly. Integration tests skip
themselves when Postgres is unreachable (see tests/conftest.py), so bringing up
`docker compose up -d postgres` is what turns them on.
"""
import subprocess
import sys


def _run_pytest(markers: str, description: str):
    """Run pytest with the given marker expression."""
    print(f"Running {description}...")
    cmd = [sys.executable, "-m", "pytest", "-v", "--tb=short"]
    if markers:
        cmd.extend(["-m", markers])
    result = subprocess.run(cmd)
    sys.exit(result.returncode)


def test_all():
    """Run all tests."""
    _run_pytest("", "all tests")


def test_unit():
    """Run unit tests."""
    _run_pytest("unit", "unit tests")


def test_integration():
    """Run integration tests."""
    _run_pytest("integration", "integration tests")


if __name__ == "__main__":
    test_all()
