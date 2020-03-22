#!/bin/sh
export PGPASSWORD=postgres
psql -h localhost -U postgres -d toucandb -a -f schema/dropall.sql
psql -h localhost -U postgres -d toucandb -a -f schema/coreschema.sql
psql -h localhost -U postgres -d toucandb -a -f schema/fill.sql