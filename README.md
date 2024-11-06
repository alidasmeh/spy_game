# spy_game

This project is developed for data collection phase of a Human-Machine interaction research to evaluate the abstract thinking capacity of LLMs.

# Stacks

Front-end: React JS
Back-end: FastAPI
Database: PostgreSQL

# run the project for the first time

Clone the project and go into the project folder and run command below:

```
docker-compose up --build
```

# update init db query

To update the db structure you should update the `init.sql` file in `init-db` folder. Then you need to delete the docker containers and rebuild it.
