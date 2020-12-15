import os

import requests

os.environ.setdefault('AWS_SECRET_KEY', "AKIARJHGD2JCAERH54XY")
os.environ.setdefault('AWS_SECRET_ACCESS_KEY', "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")
#
from instagram.client import InstagramAPI
from secret_manager import get_secret
#

ACCESS_TOKEN = "IGQVJXR284aTZA4MG1wODQ1ZAjhFdDZABV2hpVHpqam53R0ozYWxLV3RrcGhzemNRNFRhRHRrVXN5YlJlNENINU5sSjVwOE13T1hrQnpaLVNVZADBBRXFNWnUzbFp4VlhxVUx6RGhnNHBJVkRzalFEb1VPTQZDZD"


CLIENT_ID = get_secret('instagram').get('CLIENT_ID')
CLIENT_SECRET = get_secret('instagram').get('CLIENT_SECRET')

api = InstagramAPI(access_token=ACCESS_TOKEN, client_secret=CLIENT_SECRET)

popular_media = api.media_popular(count=20)
for media in popular_media:
    print(media.images['standard_resolution'].url)
print(requests.get("https://api.instagram.com/oauth/authorize?client_id=842977546504925&response_type=code&redirect_uri=https%3A%2F%2Ftrip.asapgo.net%2Fauth%2F&scope=user_profile+user_media"))
#

#
# REDIRECT_URI = "https://trip.asapgo.net/auth/"
# RAW_SCOPE = ['user_profile', 'user_media']
#
# # =AQAOkSVIn2-hF9djhOYeb-bELOQDCdlWA9Pk1E8WpU0F1fSgMMhoWg_CjHb6UCVJjoNatJ4jfb9aETW7AElU_U5ONq2rdHzlGWqAXMnJuivdVh7Qx2NoOi7sCqngxnGvO6gjrmcWhzJl0A1kgLlQoC9M8LsM1HH8CTOxanpPCKncUW4RY_-NuFQoyEadE-a6-X7I9-77V2rB8n9wGt-xswsgSybMGurw0aqq7RIOam86aA#_
# # https://www.instagram.com/oauth/authorize?client_id=3836241939771437&redirect_uri=https://trip.asapgo.net&scope=user_profile,user_media&response_type=code
#
# print(CLIENT_ID)
# api = InstagramAPI(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, redirect_uri=REDIRECT_URI)
# redirect_uri = api.get_authorize_login_url(scope=RAW_SCOPE)
# print(api.__dict__)
# # api = InstagramAPI(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
# print(redirect_uri)


# access_token = api.exchange_code_for_access_token(ACCESS_TOKEN)




# code = (str(input("Paste in code in query string after redirect: ").strip()))
#
# access_token = api.exchange_code_for_access_token(code)
# print("access token: ")
# print(access_token)
