# Docker command to setup a database

## docker command to run container

```bash
docker run -d \
  --name postgresdb \
  -e POSTGRES_USER=name \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:13
```

## docker run to go inside the postgres container

```bash
docker exec -it postgresdb psql -U name -d mydb
```

## License

[MIT License](LICENSE)
