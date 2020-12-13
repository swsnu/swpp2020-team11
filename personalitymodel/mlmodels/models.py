from django.db import models
import torch
from torch import nn
import torch.nn.functional as F
# Create your models here.
class Openness(nn.Module):
    def __init__(self):
        super(Openness, self).__init__()
        self.fc1 = nn.Linear(5,60)
        self.fc2 = nn.Linear(60,80)
        self.fc3 = nn.Linear(80,30)
        self.fc4 = nn.Linear(30,1)
    def forward(self, x):
        x = torch.sigmoid(self.fc1(x))
        x = torch.sigmoid(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = self.fc4(x)
        return x

class Cons(nn.Module):
    def __init__(self):
        super(Cons, self).__init__()
        self.fc1 = nn.Linear(5,60)
        self.fc2 = nn.Linear(60,60)
        self.fc3 = nn.Linear(60,30)
        self.fc4 = nn.Linear(30,1)
    def forward(self, x):
        x = torch.sigmoid(self.fc1(x))
        x = torch.sigmoid(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = self.fc4(x)
        return x

class Extro(nn.Module):
    def __init__(self):
        super(Extro, self).__init__()
        self.fc1 = nn.Linear(5,60)
        self.fc2 = nn.Linear(60,60)
        self.fc3 = nn.Linear(60,30)
        self.fc4 = nn.Linear(30,1)
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = self.fc4(x)
        return x

class Agree(nn.Module):
    def __init__(self):
        super(Agree, self).__init__()
        self.fc1 = nn.Linear(5,60)
        self.fc2 = nn.Linear(60,60)
        self.fc3 = nn.Linear(60,30)
        self.fc4 = nn.Linear(30,1)
    def forward(self, x):
        x = torch.sigmoid(self.fc1(x))
        x = torch.sigmoid(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = self.fc4(x)
        return x

class Neuro(nn.Module):
    def __init__(self):
        super(Neuro, self).__init__()
        self.fc1 = nn.Linear(5,60)
        self.fc2 = nn.Linear(60,60)
        self.fc3 = nn.Linear(60,30)
        self.fc4 = nn.Linear(30,1)
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = self.fc4(x)
        return x