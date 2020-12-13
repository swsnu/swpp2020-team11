from django.shortcuts import render
import torch
import json
from mlmodels.models import Openness, Cons, Extro, Agree, Neuro
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

if torch.cuda.is_available():
    device = torch.device('cuda')
else :
    device = torch.device('cpu')
openness = Openness()
openness = openness.to(device=device)
openness.load_state_dict(torch.load('./mlmodels/ml_model/modelopen.pth', map_location=device))
cons = Cons()
cons = cons.to(device=device)
cons.load_state_dict(torch.load('./mlmodels/ml_model/modelcons.pth', map_location=device))
extro = Extro()
extro = extro.to(device=device)
extro.load_state_dict(torch.load('./mlmodels/ml_model/modelext.pth', map_location=device))
agree = Agree()
agree = agree.to(device=device)
agree.load_state_dict(torch.load('./mlmodels/ml_model/modelagr.pth', map_location=device))
neuro = Neuro()
neuro = neuro.to(device=device)
neuro.load_state_dict(torch.load('./mlmodels/ml_model/modelneuro.pth', map_location=device))
# Create your views here.
@ensure_csrf_cookie
@require_http_methods(['GET'])
def personality(request):
    req_data = json.loads(request.body.decode())
    openness_data = req_data.get('openness', None)
    cons_data = req_data.get('cons', None)
    extro_data = req_data.get('extro', None)
    agree_data = req_data.get('agree', None)
    neuro_data = req_data.get('neuro', None)
    openness_data = torch.tensor(openness_data, dtype=torch.float)
    cons_data = torch.tensor(cons_data, dtype=torch.float)
    extro_data = torch.tensor(extro_data, dtype=torch.float)
    agree_data = torch.tensor(agree_data, dtype=torch.float)
    neuro_data = torch.tensor(neuro_data, dtype=torch.float)
    openness.eval()
    cons.eval()
    extro.eval()
    agree.eval()
    neuro.eval()
    score = [openness(openness_data).item(), cons(cons_data).item(), extro(extro_data).item(), agree(agree_data).item(), neuro(neuro_data).item()]
    return JsonResponse({'score': score})

