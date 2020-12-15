from account.models import PersonalityType, PersonalityTestQuestion

O=PersonalityType(classification_type='neo-pi', personality_type='O')
C=PersonalityType(classification_type='neo-pi', personality_type='C')
E=PersonalityType(classification_type='neo-pi', personality_type='E')
A=PersonalityType(classification_type='neo-pi', personality_type='A')
N=PersonalityType(classification_type='neo-pi', personality_type='N')
O.save()
C.save()
E.save()
A.save()
N.save()
PersonalityTestQuestion(question='나는 추상적인 것을 잘 이해하지 못한다.',type=O,weight=1).save()
PersonalityTestQuestion(question='나는 생생한 상상력을 가지고 있다.',type=O,weight=1).save()
PersonalityTestQuestion(question='나는 굉장한 아이디어들을 가지고 있다.',type=O,weight=1).save()
PersonalityTestQuestion(question='나는 상상력이 좋지 않다.',type=O,weight=1).save()
PersonalityTestQuestion(question='나는 수준 높은 단어를 쓰는 편이다.',type=O,weight=1).save()
PersonalityTestQuestion(question='나는 내 물건들을 여기저기에 그냥 놓는 편이다.',type=C,weight=1).save()
PersonalityTestQuestion(question='나는 물건들을 어질러 놓는 편이다.',type=C,weight=1).save()
PersonalityTestQuestion(question='나는 물건들을 제자리에 되놓은 것을 자주 잊는다.',type=C,weight=1).save()
PersonalityTestQuestion(question='나는 정해진 일정을 따르는 편이다.',type=C,weight=1).save()
PersonalityTestQuestion(question='나는 내가 맡은 일에 매우 꼼꼼한 사람이다.',type=C,weight=1).save()
PersonalityTestQuestion(question='나는 말이 적은 편이다.',type=E,weight=1).save()
PersonalityTestQuestion(question='나는 사람들을 만나면 대화를 먼저 시작하는 편이다.',type=E,weight=1).save()
PersonalityTestQuestion(question='나는 모임에서 여러 사람들과 이야기를 나누는 편이다.',type=E,weight=1).save()
PersonalityTestQuestion(question='나는 나에게 관심이나 이목이 집중되는 것을 좋아하지 않는다.',type=E,weight=1).save()
PersonalityTestQuestion(question='나는 다른 사람들의 주목을 받는 것을 꺼리지 않는다.',type=E,weight=1).save()
PersonalityTestQuestion(question='나는 다른 사람들의 감정을 잘 공감한다.',type=A,weight=1).save()
PersonalityTestQuestion(question='나는 다른 사람들의 개인적인 문제에 관심이 없다.',type=A,weight=1).save()
PersonalityTestQuestion(question='나는 마음이 여린 편이다.',type=A,weight=1).save()
PersonalityTestQuestion(question='나는 다른 사람들에 대해 별로 관심이 없다.',type=A,weight=1).save()
PersonalityTestQuestion(question='나는 주변 다른 사람들에게 내 시간을 잘 할애하는 편이다.',type=A,weight=1).save()
PersonalityTestQuestion(question='나는 쉽게 스트레스로 지치는 편이다.',type=N,weight=1).save()
PersonalityTestQuestion(question='나는 걱정이 많다.',type=N,weight=1).save()
PersonalityTestQuestion(question='나는 쉽게 속이 상한다.',type=N,weight=1).save()
PersonalityTestQuestion(question='나는 분위기를 많이 탄다.',type=N,weight=1).save()
PersonalityTestQuestion(question='나는 쉽게 우울해진다.',type=N,weight=1).save()

