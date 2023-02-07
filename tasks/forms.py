from django import forms
from django.forms import TextInput, DateInput
from .models import List, Task


class ListForm(forms.ModelForm):
    class Meta:
        model = List
        fields = ['list_name']
        widgets = {
            'list_name': TextInput(attrs={'placeholder': 'Add list', 'autocomplete': 'off'}),
        }


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['task_name', 'date_due', 'list']
        widgets = {
            'task_name': TextInput(attrs={'placeholder': 'Add task', 'autocomplete': 'off'}),
            'date_due': DateInput(attrs={'placeholder': 'DD/MM/YYYY', 'autocomplete': 'off'}),
        }
