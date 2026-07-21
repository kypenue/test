#!/usr/bin/env bash

source ../tmp/set_prod_env_for_migrations.sh

alembic upgrade head
