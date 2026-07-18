#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_healthcheck.py
Date: 2026-07-18
Description: Unit test for the /health endpoint handler.

             Ported from the Blueprint AI Agent Service
             (tests/unit/api/infrastructure/test_healthcheck.py). Upstream
             returns a plain-text Response; EchoPrint returns a JSON dict, so
             the assertions follow this service's contract.
"""
################################################################################
# built-in modules
import os

# third-party modules
import pytest

# developed modules
from src.api.infrastructure.healthcheck import health_check, router

################################################################################
@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_check_returns_ok():
    """health_check() reports liveness as {"status": "ok"}."""
    result = await health_check()
    assert result == {"status": "ok"}


@pytest.mark.unit
def test_health_route_is_hidden_from_schema():
    """The probe endpoint stays out of the public OpenAPI document."""
    route = next(r for r in router.routes if r.path == "/health")
    assert route.include_in_schema is False
    assert set(route.methods) == {"GET"}


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
