from django.contrib import admin

from .models import User, List, Task


class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'task_name', 'user']

admin.site.register(User)
admin.site.register(List)
admin.site.register(Task, TaskAdmin)
