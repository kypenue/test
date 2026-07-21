#!/usr/bin/env bash

source ../tmp/set_prod_env_for_migrations.sh

comment=$1

alembic revision --autogenerate -m "$comment"
