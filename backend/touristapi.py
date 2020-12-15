import json
import requests
import random
from urllib.parse import unquote
from plan.models import Place, Features
url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList'

content = {'12':'관광지', '14':'문화시설', '28':'레포츠', '38':'쇼핑', '39':'음식점'}
cat1 = {'A01':'자연','A02':'인문','A03':'레포츠','A04':'쇼핑','A05':'음식'}
cat2 = {'A0101':'자연관광지','A0102':'관광자원','A0201':'역사관광지','A0202':'휴양관광지','A0203':'체험관광지','A0204':'산업관광지',
    'A0205':'건축/조형물', 'A0206':'문화시설', 'A0302':'육상 레포츠','A0303':'수상 레포츠','A0304':'항공 레포츠','A0305':'복합 레포츠',
    'A0401':'쇼핑','A0502':'음식점'}
cat3 = {'A04010200':'상설시장','A04010700':'공예,공방','A05020900':'바/카페'}
key = 'C00rYUbKvYuj%2BjYkIoXUkMByuLCGgkmKN15PJq2YKZnrW6IZxu3K3QZHbkefJtLFlCKucqZoo3W3J4%2FIu71IYA%3D%3D'
params = {'pageNo':1,'numOfRows':12,'MobileApp':'AppTest','MobileOs':'ETC','arrange':'A', 'contentTypeId':14, 'areaCode':1, 'listYN':'Y','_type':'json'}
feature1 = Features(feature_name='활기찬', status=1)
feature2 = Features(feature_name='분위기 좋은', status=1)
feature3 = Features(feature_name='경치가 아름다운', status=1)
feature1.save()
feature2.save()
feature3.save()
feature = [feature1,feature2,feature3]
for k, v in content.items():
    print(k)
    for i in range(1,100):
        res = requests.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?serviceKey='+key+'&pageNo='+str(i)+'&numOfRows=12&MobileApp=AppTest&MobileOS=ETC&arrange=A&contentTypeId='+k+'&areaCode=1&listYN=Y&_type=json')
        res = res.json()
        res = res.get('response',None)
        res = res.get('body')
        res = res.get('items')
        if res:
            res=res.get('item')
        else:
            break
        for place in res:
            if place == None:
                break
            if not(place.get('mapy',None) or place.get('mapx',None)) or place['cat3']=='A03020200':
                # print(1)
                continue
            index = random.randint(0,2)
            if cat3.get(place['cat3'],None):
                type = cat3[place['cat3']]
                # print(place['mapy'])
                new_place = Place(latitude=place['mapy'],longitude=place['mapx'],type=type,name=place['title'],image_urls=place.get('firstimage',None),status=1,avg_score=0)
                new_place.save()
                new_place.features.add(feature[index])
            elif cat2.get(place['cat2'],None):
                type = cat2[place['cat2']]
                # print(place['mapy'])
                # print(2)
                new_place = Place(latitude=place['mapy'],longitude=place['mapx'],type=type,name=place['title'],image_urls=place.get('firstimage',None),status=1,avg_score=0)
                # new_place.save()
                new_place.features.add(feature[index])
a=[]
a.append(Place(latitude=37.5451952,longitude=126.9829356,type='바/카페',name='해방촌 카페',image_urls='https://t1.daumcdn.net/liveboard/dailylife/f29bf677b78149bc9595e3dbb6ccb1a2.jpg',status=1,avg_score=0).save())
a.append(Place(latitude=37.5100918,longitude=127.0495303,type='바/카페',name='카페 스물다섯',image_urls='https://t1.daumcdn.net/cfile/tistory/99F1D0475D96FDEF06',status=1,avg_score=0).save())
a.append(Place(latitude=37.5565312,longitude=126.9043147,type='바/카페',name='소셜클럽 서울',image_urls='https://lh3.googleusercontent.com/proxy/Kass0KRJykUdLsX4s11434llUUgfiFLlhrXgu2fcSEuOIed7ivzdl8cLApoW3WHw7155pZ5r7d4lvED9pCnGtMD38YjOYB4RVluZKg-h3KmHoQsFDkRLshmjUdV5NX-s1hmEP1jAf2axfUa4vPDGFbDjhULpjVVfQB6fdi4TaZ3M5g4ydSDqlse_pKE5xmLrAV56wbuP08_9jrQPZ_nnmSWt0VTVQioqxOh6HD6DerD5NK4HBV13zyNgFG45J3pdqbnEyti7gVNhR6cQmqa2BzZl_G3WinGm-MVI1QX3yzDMzqTz4I8vTIZKo9mW',status=1,avg_score=0).save())
a.append(Place(latitude=37.5446651,longitude=127.0560802,type='바/카페',name='어니언 성수카페',image_urls='https://lh3.googleusercontent.com/proxy/cuedBRED-af1pP7QCIZ8CnrjlmMwI6o8nXcwEoPofEruAjgKxtdaWiSfY91JerEGqzIlAn9bgzfo2bkQuf3Fy34Gb-KAuCMIddslR61sutS4XzEZMkjwyepC0TCXAViPwvCqWCqSRAmboNPXHDrOubLfANJWnAchG7ecy_xh7b8r1fiq2hHJV93ZObowh45jjytcOI4kIeAKQaYITKGej_V4xGcWYBSiKDYa6NePTtuO2GV9UGMGmh0b7I36SgwOOL7kga3K1bCNZinv-4vSvVrC5Yh5xP5k6rlIe_ekvDdWsuQebXfiHgVUt27jEfnQISMJJ_kFHDtfomXrONFpyQFvwoCj',status=1,avg_score=0).save())
a.append(Place(latitude=37.5221336,longitude=126.9180543,type='바/카페',name='세상의모든아침',image_urls='https://mblogthumb-phinf.pstatic.net/20160329_226/polo1510_1459189376531d9vHP_JPEG/DSC08604.JPG?type=w800',status=1,avg_score=0).save())
a.append(Place(latitude=37.513103,longitude=127.1016333,type='바/카페',name='빌즈 잠실',image_urls='https://media-cdn.tripadvisor.com/media/photo-s/07/0e/99/eb/bills-jamsil.jpg',status=1,avg_score=0).save())
a.append(Place(latitude=37.5206956,longitude=127.0232308,type='바/카페',name='C27',image_urls='https://lh3.googleusercontent.com/proxy/vsVfTKndwy8FbyRqn_4kXHE6pMyeOF5Tg1gbxwtCQVTWR69HGn8u-9yqFqHMx5YQDuBaJsGxLmyekwZmPvSyQ9G2ocPnxy1KA3ov8RYGmnx9ngEsjZtHo3C6-i-iIREcwNLF6fLjAOEqjJpKG6wTsNRCZJAjcOE42n7X5zB9yW7eT-q_htA-N9zVLls5LM744ylt08iNFqf94CvwVldxEIiWOvuq_BA4406Kbz8ye85KLt6e4TLzILG3KNRtjSMUjsE1cmV3v6mterE7RTwXKZqZABWBz4KQToCZ2SdDUx4',status=1,avg_score=0).save())
a.append(Place(latitude=37.5522988,longitude=126.9118055,type='바/카페',name='빌리프커피',image_urls='https://t1.daumcdn.net/cfile/tistory/215206435559AC1A2E',status=1,avg_score=0).save())
a.append(Place(latitude=37.5818889,longitude=126.9994807,type='바/카페',name='학립다방',image_urls='https://tgzzmmgvheix1905536.cdn.ntruss.com/2019/09/82102f56b67e4381810211cab44175ce',status=1,avg_score=0).save())
a.append(Place(latitude=37.5491864,longitude=126.8853719,type='바/카페',name='콜린',image_urls='https://mblogthumb-phinf.pstatic.net/MjAxODA3MjZfMTMx/MDAxNTMyNTcxOTU4MDA5.W1toQisaGvksyhMjtF8Eh4r4X7xbBJUADB9g4QQXMMog.62Pw8qWdUh04wHEU1u9hpQlj2VLJskkzsRha1py7Q7og.JPEG.rkdals530/image_7488044111532569004712.jpg?type=w800',status=1,avg_score=0).save())
a.append(Place(latitude=37.5108022,longitude=127.0579168,type='바/카페',name='테라로사',image_urls='https://post-phinf.pstatic.net/MjAxODA4MTNfMjcz/MDAxNTM0MTIzNjgyMjU3.wttM3RlP0hG3hWIB3sBe2e2zodveSuV_CIN2qpVe_fgg.q9g0n8SxNQb32cdXZ430tD4LB9F0cFA-Z5ilUFNxU-cg.JPEG/20180810_103922_HDR.jpg?type=w1200',status=1,avg_score=0).save())
a.append(Place(latitude=37.5409819,longitude=126.9468399,type='바/카페',name='프릳츠 도화점',image_urls='https://mblogthumb-phinf.pstatic.net/MjAyMDA0MjRfOCAg/MDAxNTg3NzAzNDczODAy.ItpyZyemJ36k7dKDtdLh_R5DyGXZc1S2uIA6Yen_Z2kg.zTzhyYxlityClAwgKNYNfwcemGaT7lIe0OLLSnqOGGgg.JPEG.kwonek1990/IMG_0199.JPG?type=w800',status=1,avg_score=0).save())
a.append(Place(latitude=37.545823,longitude=126.9162463,type='바/카페',name='앤트러사이트',image_urls='https://lh5.googleusercontent.com/p/AF1QipOEHSRE-s2Bjj4rK7Ar6noL61j2Sg1x9JtFH8YE=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5231185,longitude=127.0063281,type='바/카페',name='마피아디저트',image_urls='https://media-cdn.tripadvisor.com/media/photo-p/11/94/80/40/photo1jpg.jpg',status=1,avg_score=0).save())
a.append(Place(latitude=37.569031,longitude=126.9839283,type='바/카페',name='반쥴',image_urls='https://t1.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/36B/image/IxBCzUdfLLuq9BzJStxboeAPp4I.png',status=1,avg_score=0).save())
a.append(Place(latitude=37.5772756,longitude=126.9712871,type='바/카페',name='미술관옆집',image_urls='https://www.noblesse.com/shop/data/board/restaurant/188414f6a5819467',status=1,avg_score=0).save())
a.append(Place(latitude=37.561505,longitude=126.9224779,type='바/카페',name='듀윗',image_urls='https://mblogthumb-phinf.pstatic.net/MjAxODA1MjNfMTA4/MDAxNTI3MDg1Mjc5MTIz.RACB-FFpN3u1yj6iINgpP61W9BwDZdeh7fL3jJSXE4Qg.bHJud7SoqUZUGkfWHkt5-AjhA_z-2ktgASyqP1oqIE8g.JPEG.snflgg/DSC09322.JPG?type=w800',status=1,avg_score=0).save())

a.append(Place(latitude=37.5371284,longitude=127.1174927,type='음식점',name='마드레',image_urls='https://mp-seoul-image-production-s3.mangoplate.com/added_restaurants/477776_1488620884667846.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80',status=1,avg_score=0).save())
a.append(Place(latitude=37.552619,longitude=127.1567846,type='음식점',name='마실',image_urls='https://mp-seoul-image-production-s3.mangoplate.com/415475_1561003378643758.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80',status=1,avg_score=0).save())
a.append(Place(latitude=37.5396815,longitude=127.1391766,type='음식점',name='자성화맛집코다리네',image_urls='https://i.ytimg.com/vi/XvJmmBb6pTY/maxresdefault.jpg',status=1,avg_score=0).save())
a.append(Place(latitude=37.5325855,longitude=127.1200278,type='음식점',name='보타이',image_urls='https://mblogthumb-phinf.pstatic.net/MjAxODA1MTZfMTc0/MDAxNTI2NDI5MTc0ODcx.DoMD7pl8832QCVY3KjYbtiGFR0oLGZMDMMQNJVcXDukg.CMwqdB5Fs6Ymc5u5ybExOVyAaNaZrPbcG4XmFVw7unIg.JPEG.ysjin5545/IMG_2889.jpg?type=w800',status=1,avg_score=0).save())
a.append(Place(latitude=37.5361446,longitude=127.1286572,type='음식점',name='데카망',image_urls='https://s3-ap-northeast-1.amazonaws.com/dcreviewsresized/20200722015350_photo1_63dcc316c40f.jpg',status=1,avg_score=0).save())

a.append(Place(latitude=37.6377214,longitude=127.0239908,type='음식점',name='양다리걸쳤네',image_urls='https://lh5.googleusercontent.com/p/AF1QipNiu_EMeFwD6w8kOJuCYa0_Y34_SSGhvmoU5dVR=w426-h240-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.6360643,longitude=127.0349243,type='음식점',name='하산바바',image_urls='https://lh5.googleusercontent.com/p/AF1QipP5QcdrdkSY8yH-228k0h1vFKB3U8blCq_uM_Ut=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.6399431,longitude=127.0117975,type='음식점',name='에림들깨칼국수',image_urls='https://lh5.googleusercontent.com/p/AF1QipOvbn5d_0vN7uzcp4RrejTuLY1sw84iDH0JPzkL=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.6314866,longitude=127.0227436,type='음식점',name='옛곰탕집',image_urls='https://lh5.googleusercontent.com/p/AF1QipOmmB4G5TjolfND0z7pJVti0cN2vjDWtsw_0TU=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.6456645,longitude=127.0070756,type='음식점',name='대보명가',image_urls='https://mp-seoul-image-production-s3.mangoplate.com/14226/855261_1584185970695_14846?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80',status=1,avg_score=0).save())


a.append(Place(latitude=37.5049645,longitude=126.8907084,type='음식점',name='이실이네',image_urls='https://lh5.googleusercontent.com/p/AF1QipMAica-1ZxnB3-EuddaMmsnCSRJPNCHUb9HL04r=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.4991504,longitude=126.8873892,type='음식점',name='초가집 부뚜막청국장',image_urls='https://lh5.googleusercontent.com/p/AF1QipM3IwolgEDrJCf3RjUjhLWRExR5VYwFdHVvG3ar=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.4826522,longitude=126.8998769,type='음식점',name='황제해물보쌈',image_urls='https://lh5.googleusercontent.com/p/AF1QipPjgZo1tEXZHBLy9Fepy-Dh9y5kPRBCi0Ho1m3x=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5093957,longitude=126.8877258,type='음식점',name='문어부인삼교비 신도림점',image_urls='https://lh5.googleusercontent.com/p/AF1QipNlXlstrwiGwatHYPgeC9fIiJNZk0_foSvRZW5Q=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.490202,longitude=126.858558,type='음식점',name='개봉칼국수',image_urls='https://lh5.googleusercontent.com/p/AF1QipPKmDX1NJG_4e8u90IBpNzBfA6jfNVqEUBeACuf=w426-h240-k-no',status=1,avg_score=0).save())

a.append(Place(latitude=37.4502977,longitude=126.9017858,type='음식점',name='논빼미',image_urls='https://lh5.googleusercontent.com/p/AF1QipMeuo7y8JPQYxsd7RXlKTmnfh0RoQ2FtMF76PJx=w408-h408-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.4723039,longitude=126.8993152,type='음식점',name='순댕이네 얼큰수제비',image_urls='https://lh5.googleusercontent.com/p/AF1QipOxL0pDgrK5ebB8VgkCZ2rfg7Z12QrMAkRrOY8D=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.4538055,longitude=126.9030043,type='음식점',name='오복식당',image_urls='https://lh5.googleusercontent.com/p/AF1QipOmfJttrrz5iDK90HhLIevpNrgGev6wro5eWkXH=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.4504884,longitude=126.9099068,type='음식점',name='솔향기',image_urls='https://lh5.googleusercontent.com/p/AF1QipP1U4qul7ua9Tyb6HGJyDePqoEFQpzUycXagpEp=w493-h240-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.4787684,longitude=126.8818474,type='음식점',name='동남집',image_urls='https://lh5.googleusercontent.com/p/AF1QipNr4XE87Bc5zZeGxxGwij2lpLFYdEwcu0f_pLqK=w426-h240-k-no',status=1,avg_score=0).save())

a.append(Place(latitude=37.6499506,longitude=127.0342657,type='음식점',name='태림산채정식',image_urls='https://lh5.googleusercontent.com/p/AF1QipP__qYx9AxRYaxOBI9XxVlMTJwua-NyT5NQdrj2=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.658408,longitude=127.034356,type='음식점',name='복진해물잔치마당',image_urls='https://lh5.googleusercontent.com/p/AF1QipPK_wp5lM1fYEwIqBUfxh9XkwohsOSao8PJwKkW=w503-h240-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.6620613,longitude=127.0329025,type='음식점',name='수정궁',image_urls='https://lh5.googleusercontent.com/p/AF1QipMUUrT9g9x9PIZiuhlkk2lskwFbNX6pxbiApmws=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.6527292,longitude=127.0465615,type='음식점',name='마쯔무라 돈까스 본점',image_urls='https://lh5.googleusercontent.com/p/AF1QipOdorqQh6YYi5fca7CMcmx_1tp8y6ogqDgK69gj=w426-h240-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.6753466,longitude=127.0467651,type='음식점',name='묵은지사랑',image_urls='https://lh5.googleusercontent.com/p/AF1QipO6ZjEV2VJ-TNg0KVKC-qKxaElZb2rYRcgt4aTm=w408-h306-k-no',status=1,avg_score=0).save())

a.append(Place(latitude=37.5257602,longitude=126.874703,type='음식점',name='양천뼈다귀',image_urls='https://lh5.googleusercontent.com/p/AF1QipPZHrvlN5gILNzEiAiHYXfDzqC65fksyYxr2xe8=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5189123,longitude=126.8715284,type='음식점',name='평미가',image_urls='https://lh5.googleusercontent.com/p/AF1QipO8dIQ_BZBX3f9AH9PgRKm2NdxYP9rTBapBMcws=w408-h272-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.524851,longitude=126.8758371,type='음식점',name='해몽',image_urls='https://lh5.googleusercontent.com/p/AF1QipMEURXP2knWmvFAsmwk_TiDRT_RHLbslyYsmSdE=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5253732,longitude=126.8729342,type='음식점',name='일미락',image_urls='https://lh5.googleusercontent.com/p/AF1QipNvy4dkp_X_AQM6sbBzC-3tUZcEBYSbKa3mr4ev=w408-h408-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5194444,longitude=126.8575,type='음식점',name='살구나무집칼국수',image_urls='https://lh5.googleusercontent.com/p/AF1QipNZGmK_02pRqesuhtNXZ35gIiyw1komemTZDM7Y=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5192609,longitude=126.871509,type='음식점',name='남원추어탕',image_urls='https://lh5.googleusercontent.com/p/AF1QipM8sQMqbxdbnVIFDnnV4c4LC-f9DIOn3a4U7Has=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.532547,longitude=126.866352,type='음식점',name='목동맛집 행복한오리한상',image_urls='https://lh5.googleusercontent.com/p/AF1QipMSHF4JZln8SsRwvVdnCbQVGcUezI2hhUfxXdBM=w408-h306-k-no',status=1,avg_score=0).save())

a.append(Place(latitude=37.60525,longitude=127.0768673,type='음식점',name='태능배밭갈비',image_urls='https://lh5.googleusercontent.com/p/AF1QipNXVnluJtGmFRtrrAdNKBBfEi9_6g4_UgLnM-cl=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.586451,longitude=127.09493,type='음식점',name='농부보쌈',image_urls='https://lh5.googleusercontent.com/p/AF1QipO6DfIxp0YkWMO7OwgvuV22Ze-oHrGtNK4ih0qy=w408-h544-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5944127,longitude=127.1015177,type='음식점',name='용마해장국',image_urls='https://lh5.googleusercontent.com/p/AF1QipPnuQ7LMSc818lQVfFn3ZO-80ftqjXslhqbETSW=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5953283,longitude=127.0859751,type='음식점',name='까망통돼지',image_urls='https://lh5.googleusercontent.com/p/AF1QipMuvU3XqoXrStCahx0sdlZxU96ce0tPtSsOU-S8=w507-h240-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5988021,longitude=127.0994526,type='음식점',name='대관령쌈밥',image_urls='https://lh5.googleusercontent.com/p/AF1QipPlt6S5q5unlch-9EzPv698EH5uxG_koggVKAWp=w408-h271-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5942499,longitude=127.0878807,type='음식점',name='강금옥쭈꾸미',image_urls='https://mp-seoul-image-production-s3.mangoplate.com/231718_1537008777500844.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80',status=1,avg_score=0).save())
a.append(Place(latitude=37.6135624,longitude=127.1057762,type='음식점',name='벌교계절맛집',image_urls='https://lh5.googleusercontent.com/p/AF1QipPGOi1tfvV_PGRtn7h6fgiuJHqSNLKMR-SYRhfc=w408-h306-k-no',status=1,avg_score=0).save())
a.append(Place(latitude=37.5889128,longitude=127.0925753,type='음식점',name='면목식탁',image_urls='https://lh5.googleusercontent.com/p/AF1QipMP1JsjxSIRVdgQQGl_us27WTd08hlRGBLYY2lx=w408-h408-k-no',status=1,avg_score=0).save())

for place in Place.objects.all():
    index = random.randint(0,2)
    place.features.add(feature[index])
    place.save()