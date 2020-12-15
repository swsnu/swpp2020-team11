import atexit
import json
import os
import time
from pathlib import Path
from selenium import webdriver

from models.area import Area
from models.location import Location
from utils.selenium_util import page_load_waiter, safe_try

ROOT_DIR = os.path.dirname(Path(__file__).parent)

LOCATION_DETAIL_URL = "https://www.instagram.com/explore/locations/{location_id}/?__a=1"
KOREA_AREA_LIST_URL = "https://www.instagram.com/explore/locations/KR/south-korea/?page={index}"
LOGIN_URL = "https://www.instagram.com/accounts/login/?source=auth_switcher"


class ChromeDriver:
    INTRINSIC_WAIT = 10
    EXTRINSIC_WAIT = 5
    MAX_ITERATION = 100

    def __init__(self):
        self.driver = webdriver.Chrome(ROOT_DIR + '/asset/chromedriver')
        self.driver.minimize_window()
        self.login = False
        atexit.register(self.cleanup)

    @page_load_waiter
    def login(self, username, password):
        self.driver.get(LOGIN_URL)
        self.driver.implicitly_wait(self.INTRINSIC_WAIT)
        user = self.driver.find_element_by_name('username')
        user.send_keys(username)
        passwd = self.driver.find_element_by_name("password")
        passwd.send_keys(password)
        self.driver.implicitly_wait(self.INTRINSIC_WAIT)
        button = self.driver.find_element_by_css_selector("button[type=submit]")
        button.click()
        self.login = True

    def cleanup(self):
        self.driver.quit()

    @page_load_waiter
    def _skip_remember_password(self):
        button = self.driver.find_element_by_xpath("//*[contains(text(), '나중에 하기')]")
        button.click()

    @page_load_waiter
    def _skip_basic_setting(self):
        button = self.driver.find_element_by_xpath("//*[contains(text(), '나중에 하기')]")
        button.click()

    @page_load_waiter
    def _click_more_contents(self, limit=MAX_ITERATION):
        for i in range(limit):
            next_buttons = self.driver.find_elements_by_xpath("//*[contains(text(), '더 보기')]")
            if not next_buttons:
                break
            next_buttons[0].click()
            time.sleep(self.EXTRINSIC_WAIT)
            self.driver.implicitly_wait(self.INTRINSIC_WAIT)

    @safe_try
    def get_location_areas(self):
        area_objs = []
        for i in range(1, self.MAX_ITERATION):
            self.driver.get(KOREA_AREA_LIST_URL.format(index=i))
            self.driver.implicitly_wait(self.INTRINSIC_WAIT)

            areas = self.driver.find_elements_by_tag_name("a")

            for x in areas:
                if x.text == '':
                    break
                area_objs.append(Area('KR', x.text, x.get_attribute('href')))

            next_buttons = self.driver.find_elements_by_xpath("//*[contains(text(), '더 보기')]")
            if not next_buttons:
                break

        return area_objs

    @safe_try
    def get_locations(self, area):
        location_objs = []
        for i in range(1, self.MAX_ITERATION):
            self.driver.get(f'{area.url}?page={i}')
            self.driver.implicitly_wait(self.INTRINSIC_WAIT)

            locations = self.driver.find_elements_by_css_selector("ul > li > a")
            for location in locations:
                if location.text == '':
                    break
                location_id = location.get_attribute('href').split('/')[5]
                url = location.get_attribute('href')
                location_objs.append(Location(location_id, area.country, area, location.text, url))
            next_buttons = self.driver.find_elements_by_xpath("//*[contains(text(), '더 보기')]")
            if not next_buttons:
                break
        return location_objs

    def get_location_detail(self, location):
        self.driver.get(LOCATION_DETAIL_URL.format(location_id=location.id))
        res = json.loads(self.driver.find_element_by_css_selector('pre').text)
        res_location = res.get('graphql', {}).get('location', {})
        address = res_location.get('address_json', None)
        if not address:
            return
        road_address = json.loads(address).get("street_address", None)
        lat = res_location.get('lat', None)
        lng = res_location.get('lng', None)

        return {"road_address": road_address, "lat": lat, "lng": lng, "name": location.name}
