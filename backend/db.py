from plan.models import *
from account.models import User
from datetime import datetime
from django.utils import timezone

user = User.objects.create_user(email='example@naver.com', nickname='example', phone_number='', password='helloworld')
user.save()
plan1 = Plan(user=user, head_count=1, started_at=timezone.make_aware(datetime(2020, 11, 6, 15, 19, 1)),
    ended_at=timezone.make_aware(datetime(2020, 11, 6, 20, 0, 30)), feedback=-1)
plan1.save()
plan2 = Plan(user=user, head_count=1, started_at=timezone.make_aware(datetime(2020, 11, 7, 18, 19, 1)),
    ended_at=timezone.make_aware(datetime(2020, 11, 7, 21, 0, 30)), feedback=-1)
plan2.save()
plan3 = Plan(user=user, head_count=1, started_at=timezone.make_aware(datetime(2020, 11, 8, 15, 21, 1)),
    ended_at=timezone.make_aware(datetime(2020, 11, 8, 20, 0, 30)), feedback=-1)
plan3.save()
plan4 = Plan(user=user, head_count=1, started_at=timezone.make_aware(datetime(2020, 11, 9, 15, 19, 1)),
    ended_at=timezone.make_aware(datetime(2020, 11, 9, 20, 0, 30)), feedback=-1)
plan4.save()
taxi = Taxi(company='hi', car_number='02가 0125', phone_number='+821043243211')
taxi.save()
transportation = TransportationReservation(taxi=taxi, reservation_name='stub user', status=1,
                        head_count=1, tot_price=10000)
transportation.save()
feature1 = Features(feature_name='분위기', status=1)
feature2 = Features(feature_name='도심 속 산', status=1)
feature3 = Features(feature_name='활동적인', status=1)
feature4 = Features(feature_name='수제버거', status=1)
feature5 = Features(feature_name='시원한', status=1)
feature6 = Features(feature_name='한강공원', status=1)
feature7 = Features(feature_name='남산 돈가스', status=1)
feature1.save()
feature2.save()
feature3.save()
feature4.save()
feature5.save()
feature6.save()
feature7.save()
place1 = Place(latitude=37.4429377, longitude=126.9522476, type='산',
            name='관악산', image_urls='https://lh5.googleusercontent.com/p/AF1QipMMpnK2j-KXIBQZClQgl9SHmDGdoyVUTp5rPAFe=w426-h240-k-no',
            status=1, avg_score=3.5)
place1.save()
place1.features.add(feature2)
place2 = Place(latitude=37.6608321, longitude=126.9845782, type='산',
            name='북한산', image_urls='https://search.pstatic.net/common/?autoRotate=true&quality=95&size=168x130&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20150831_259%2F14409922621599Cqxh_JPEG%2F11491416_1.jpg&type=f',
            status=1, avg_score=3.5)
place2.save()
place2.features.add(feature2)
place3 = Place(latitude=37.5537577, longitude=126.9722148, type='산',
            name='남산', image_urls='https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20100430_61%2Fkent5285_1272623515963IXohV_jpg%2Fl1001379.jpg-%25B3%25B2%25BB%25EA_%25BA%25A2%25B2%25C9_%25BB%25EA%25C3%25A5_ke',
            status=1, avg_score=3.5)
place3.save()
place3.features.add(feature3)
place4 = Place(latitude=37.4772964, longitude=126.958394, type='음식',
            name='돈파스팔레', image_urls='https://search.pstatic.net/common/?autoRotate=true&quality=95&size=168x130&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_289%2F1446623193931bk3Lq_JPEG%2F167054567652065_1.jpg&type=f',
            status=1, avg_score=3.5)
place4.save()
place4.features.add(feature1)
place5 = Place(latitude=37.4771844, longitude=126.9561644, type='음식',
            name='9ounce burger', image_urls='https://search.pstatic.net/common/?autoRotate=true&quality=95&size=168x130&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_123%2F1446623089057duSbk_JPEG%2F167054567467570_0.jpg&type=f',
            status=1, avg_score=3.5)
place5.save()
place5.features.add(feature4)
place6 = Place(latitude=37.5569004, longitude=126.9835313, type='음식',
            name='101번지 남산돈까스', image_urls='https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ-j85O8pIZS7pnsvTS42KiSt3pjvNCy1j6Pw&usqp=CAU',
            status=1, avg_score=3.5)
place6.save()
place6.features.add(feature7)
place7 = Place(latitude=37.4711225, longitude=126.9613138, type='공원',
            name='낙성대공원', image_urls='https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20130616_201%2Fstop73_1371386378729vQAMz_JPEG%2FCAM01296.jpg&type=sc960_832',
            status=1, avg_score=3.5)
place7.save()
place7.features.add(feature3)
place8 = Place(latitude=37.5291281, longitude=127.0691572, type='공원',
            name='뚝섬 한강공원', image_urls='https://search.pstatic.net/common/?autoRotate=true&quality=95&size=168x130&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200108_162%2F1578416371561uOzSj_JPEG%2FtUlPc6cbL-EvNHvYMLDSj01Y.jpg&type=f',
            status=1, avg_score=3.5)
place8.save()
place8.features.add(feature6)
place9 = Place(latitude=37.5132452, longitude=127.1016887, type='타워',
            name='롯데타워', image_urls='https://img2.tmon.kr/cdn3/deals/2019/07/31/2303260870/original_2303260870_front_b9472_1564556823production.jpg',
            status=1, avg_score=3.5)
place9.save()
place9.features.add(feature1)
reservation1 = PlaceReservation(place=place1, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation2 = PlaceReservation(place=place2, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation3 = PlaceReservation(place=place3, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation4 = PlaceReservation(place=place4, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation5 = PlaceReservation(place=place5, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation6 = PlaceReservation(place=place6, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation7 = PlaceReservation(place=place7, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation8 = PlaceReservation(place=place8, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation9 = PlaceReservation(place=place9, reservation_name='user1', status=1, head_count=1, tot_price=10000)
reservation1.save()
reservation2.save()
reservation3.save()
reservation4.save()
reservation5.save()
reservation6.save()
reservation7.save()
reservation8.save()
reservation9.save()
halfdayoff1 = HalfDayOffReservation(transportation=transportation, activity=reservation1, dinner=reservation4, scenary=reservation7)
halfdayoff2 = HalfDayOffReservation(transportation=transportation, activity=reservation2, dinner=reservation5, scenary=reservation8)
halfdayoff3 = HalfDayOffReservation(transportation=transportation, activity=reservation3, dinner=reservation6, scenary=reservation9)
halfdayoff4 = HalfDayOffReservation(transportation=transportation, activity=reservation3, dinner=reservation6, scenary=reservation9)
halfdayoff1.save()
halfdayoff2.save()
halfdayoff3.save()
halfdayoff4.save()
review1 = Review(user=user, place=place1, plan=plan1, score=4.5, content='도시 경치가 좋아요.')
review2 = Review(user=user, place=place4, plan=plan1, score=4, content='비싸지만 맛있었어요.')
review3 = Review(user=user, place=place7, plan=plan1, score=3, content='밤에 천천히 산책하기 좋아요.')
review4 = Review(user=user, place=place2, plan=plan2, score=2, content='사람이 많았어요.')
review5 = Review(user=user, place=place5, plan=plan2, score=3.5, content='먹기 편했어요.')
review6 = Review(user=user, place=place8, plan=plan2, score=3, content='밤에 산책하기 좋았어요.')
review1.save()
review2.save()
review3.save()
review4.save()
review5.save()
review6.save()
