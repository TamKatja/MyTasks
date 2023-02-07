from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    pass


class List(models.Model):
    list_name = models.CharField(max_length=50)
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.list_name


class Task(models.Model):
    task_name = models.CharField(max_length=250)
    date_created = models.DateField(blank=True, auto_now_add=True, editable=False)
    date_due = models.DateField(blank=True, null=True)
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)
    list = models.ForeignKey(List, blank=True, null=True, on_delete=models.SET_NULL)
    
    class Meta:
        ordering = ['date_due', 'date_created']

    def __str__(self):
        return self.task_name
