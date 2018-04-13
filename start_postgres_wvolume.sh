#!/bin/bash
docker run --rm --name hoycomo-postgres -e POSTGRES_PASSWORD=root -e POSTGRES_USER=root -e POSTGRES_DB=hoycomo -p 5432:5432 -v hoycomopv:/var/lib/postgresql/data -d postgres