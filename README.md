# swpp2020-team11

# environments
- Yarn 1.17.3 or above
- Python 3.8.5
- pip3 20.1.1


# Frontend
### run
at root repositiory, type the following commands

```
cd frontend
yarn install
yarn start
```

### test
at root repository, type the following commands

```
cd frontend
yarn install
yarn test --coverage --watchAll=false
```

# Backend
### run
at root repository, type the following commands

```
cd backend
python3 manage.py migrate
python3 manage.py runserver
```

### test
at root repository, type the following commands

```
cd backend
coverage run --source='./asapgo' manage.py test && coverage report
# statement coverage
coverage run --branch --source='./asapgo' manage.py test && coverage report
# branch coverage
```
