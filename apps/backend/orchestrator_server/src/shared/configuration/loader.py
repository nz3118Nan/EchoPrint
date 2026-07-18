import os
from pathlib import Path

import yaml

from src.shared.configuration.schema import Model

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class ConfigLoader:
    _instance: Model | None = None

    @classmethod
    def create(cls) -> Model:
        if cls._instance is None:
            config_path = PROJECT_ROOT / "src/shared/configuration/system/config.yaml"
            content = os.path.expandvars(config_path.read_text())
            cls._instance = Model.model_validate(yaml.safe_load(content))
        return cls._instance
