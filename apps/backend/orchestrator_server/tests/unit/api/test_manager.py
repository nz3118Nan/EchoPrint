#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_manager.py
Date: 2026-07-18
Description: Unit tests for API router composition.

             Guards the mount points the frontend and the infra probes depend
             on: a prefix typo here is invisible until deploy, so it is asserted
             explicitly rather than inferred.
"""
################################################################################
# built-in modules
import os

# third-party modules
import pytest

# developed modules
from src.api.manager import api_router

################################################################################
API_PREFIX = "/echoprint/api"


def _route_map() -> dict[str, set[str]]:
    """Path -> HTTP methods, for every route on the composed router."""
    return {route.path: set(route.methods) for route in api_router.routes}


@pytest.mark.unit
def test_router_carries_echoprint_prefix():
    """Every mounted route lives under the /echoprint/api prefix."""
    assert api_router.prefix == API_PREFIX
    for path in _route_map():
        assert path.startswith(API_PREFIX), f"{path} escapes the API prefix"


@pytest.mark.unit
@pytest.mark.parametrize(
    "path, method",
    [
        (f"{API_PREFIX}/health", "GET"),
        (f"{API_PREFIX}/auth/sync", "POST"),
    ],
)
def test_expected_routes_are_mounted(path, method):
    """The health probe and the auth sync endpoint are reachable."""
    routes = _route_map()
    assert path in routes, f"missing route {path}; have {sorted(routes)}"
    assert method in routes[path]


@pytest.mark.unit
def test_routes_are_tagged_for_docs():
    """Routes carry tags so the OpenAPI page stays grouped."""
    tags = {tag for route in api_router.routes for tag in getattr(route, "tags", [])}
    assert {"infrastructure", "auth"}.issubset(tags)


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
