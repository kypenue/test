#!/usr/bin/env bash

source ../tmp/set_stage_env_for_migrations.sh

alembic upgrade head
