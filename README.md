# swpp2020-team11
[![Build Status](https://travis-ci.com/swsnu/swpp2020-team11.svg?branch=master)](https://travis-ci.com/swsnu/swpp2020-team11)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team11&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team11)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2020-team11/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp2020-team11?branch=master)

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
coverage run --source='.' manage.py test && coverage report
# statement coverage
coverage run --branch --source='.' manage.py test && coverage report
# branch coverage
```
