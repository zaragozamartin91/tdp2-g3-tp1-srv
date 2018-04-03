#!/bin/bash
docker run -it --rm --link hoycomo-postgres:postgres postgres psql -h postgres -U root hoycomo
