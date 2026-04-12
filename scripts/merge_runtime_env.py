#!/usr/bin/env python3

from pathlib import Path
import sys


def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit("usage: merge_runtime_env.py <env-file> <updates-file>")

    env_path = Path(sys.argv[1])
    updates_path = Path(sys.argv[2])

    env_lines = env_path.read_text(encoding="utf-8").splitlines() if env_path.exists() else []
    updates: dict[str, str] = {}

    if updates_path.exists():
        for line in updates_path.read_text(encoding="utf-8").splitlines():
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            if value:
                updates[key] = value

    for key, value in updates.items():
        for index, line in enumerate(env_lines):
            if line.startswith(f"{key}="):
                env_lines[index] = f"{key}={value}"
                break
        else:
            env_lines.append(f"{key}={value}")

    env_path.write_text("\n".join(env_lines) + ("\n" if env_lines else ""), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())