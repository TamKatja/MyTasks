from django.conf import settings
from django.utils import timezone
from rest_framework import serializers

from .models import List, Task


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    date_due = serializers.DateField(allow_null=True, input_formats=settings.DATE_INPUT_FORMATS)
    days_until_due = serializers.SerializerMethodField()

    # Calculate days between current date and task due date 
    def get_days_until_due(self, obj):
        date_due = obj.date_due
        if date_due:
            now = timezone.localtime(timezone.now()).date()
            days = (date_due - now).days
            return days
        else:
            return None

    # Ensure task due date is not set before current date
    def validate(self, data):
        date_due = data.get('date_due')
        if date_due:
            if date_due < timezone.localtime(timezone.now()).date():
                raise serializers.ValidationError({'date_due': 'Invalid date due'})
        return data

    class Meta:
        model = Task
        fields = [
            'id',
            'task_name',
            'date_created',
            'date_due',
            'days_until_due',
            'list',
            'user',
        ]