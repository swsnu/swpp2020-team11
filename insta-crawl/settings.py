from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from secret_manager import get_secret

POSTGRES_CONNECT_URL = 'postgresql://{user}:{password}@{host}:{port}/{database}'

# connect with backend
engine = create_engine(
    POSTGRES_CONNECT_URL.format(
        user=get_secret('asapgo-database').get('USER'),
        password=get_secret('asapgo-database').get('PASSWORD'),
        host=get_secret('asapgo-database').get('HOST'),
        port=get_secret('asapgo-database').get('PORT'),
        database=get_secret('asapgo-database').get('DATABASE'),
    )
)

# set automap
metadata = MetaData()
metadata.reflect(engine)

Base = automap_base(metadata=metadata)
Base.prepare(engine)

# tables
plan_place = Base.classes.plan_place

# sessions
session = Session(engine)
