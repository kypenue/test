#!/usr/bin/env bash

source ../tmp/set_local_env_for_migrations.sh

alembic upgrade head
