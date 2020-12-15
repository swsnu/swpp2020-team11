import os
import time
import traceback
from pathlib import Path

ROOT_DIR = os.path.dirname(Path(__file__).parent)


def page_load_waiter(func):
    def wrapper(*args, **kwargs):
        chrome_driver = args[0]
        value = func(*args, **kwargs)
        time.sleep(chrome_driver.EXTRINSIC_WAIT)
        chrome_driver.driver.implicitly_wait(chrome_driver.INTRINSIC_WAIT)
        return value

    return wrapper


def safe_try(func):
    def wrapper(*args, **kwargs):
        chrome_driver = args[0]
        try:
            return func(*args, **kwargs)
        except:
            with open(f"{ROOT_DIR}/crawler.log", "w") as log:
                traceback.print_exc(file=log)
            with open(f'{ROOT_DIR}/error.html', 'w') as f:
                print(chrome_driver.driver.page_source, file=f)
            return None

    return wrapper


def login_required(func):
    def wrapper(*args, **kwargs):
        chrome_driver = args[0]
        if not chrome_driver.login:
            raise Exception('login required')
        return func(*args, **kwargs)

    return wrapper
