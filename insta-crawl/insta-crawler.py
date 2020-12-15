import json

from tqdm import tqdm

from models.crawler import ChromeDriver
from secret_manager import get_secret

USERNAME = get_secret('instagram').get('USERNAME')
PASSWORD = get_secret('instagram').get('PASSWORD')

driver = ChromeDriver()
areas = driver.get_location_areas()
areas = [area for area in areas if area.name == "Seoul"]
fail_area = []
fail_location = []
for area in tqdm(areas):
    results = []
    locations = driver.get_locations(area)
    if locations is None:
        fail_area.append(area)
    for i, location in enumerate(tqdm(locations)):
        try:
            results.append(driver.get_location_detail(location))
        except:
            fail_location.append(location.name)
        if i % 100 and i != 0:
            with open(f'result/{area.name}{i // 100}', 'w') as f:
                f.write(json.dumps(results))

with open('result/fail', 'w') as f:
    f.write(json.dumps(fail_location))
