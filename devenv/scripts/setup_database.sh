#!/bin/sh
PGPASSWORD=postgres psql -h localhost -U postgres -d toucandb -a -f schema/coreschema.sql
PGPASSWORD=postgres psql -h localhost -U postgres -d toucandb -a -f schema/fill.sql