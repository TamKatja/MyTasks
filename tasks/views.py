from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User, List, Task
from .forms import ListForm, TaskForm
from .serializers import ListSerializer, TaskSerializer


@login_required()
def index(request):
    # Instantiate add-list-form and add-task form
    list_form = ListForm()
    task_form = TaskForm()
    context = {
        "list_form": list_form,
        "task_form": task_form,
    }
    return render(request, "tasks/index.html", context)


def login_user(request):
    context = {"page": "login"}
    # Hide login page if user already logged in
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    # User submits login form
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            context["error"] = "Invalid username and/or password 🤨"
            return render(request, "tasks/login.html", context)
    return render(request, "tasks/login.html", context)


def logout_user(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register_user(request):
    context = {"page": "register"}
    # Hide register page if user already logged in
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    # User submits registration form
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        password_confirmation = request.POST.get("password-confirmation")
        # Check if password matches confirmation
        if password != password_confirmation:
            context["error"] = "Passwords must match 😕"
            return render(request, "tasks/login.html", context)
        try:
            # Create new user object
            user = User.objects.create(username=username, password=password)
            user.save()
            # Login new user
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        except IntegrityError:
            # Ensure username is unique
            context["error"] = "Username already taken 😔"
            return render(request, "tasks/login.html", context)
    return render(request, "tasks/login.html", context)


# API views #


@api_view(["GET", "POST"])
def api_lists(request):
    if request.method == "GET":
        # Retrieve all user lists
        lists = List.objects.filter(user=request.user)
        serializer = ListSerializer(lists, many=True)
        return Response(serializer.data)

    # User creates list
    elif request.method == "POST":
        serializer = ListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Invalid list name."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "DELETE"])
def api_list(request, list_id):
    try:
        list = List.objects.get(id=list_id)
    except List.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Retrieve list object data
    if request.method == "GET":
        serializer = ListSerializer(list)
        return Response(serializer.data)

    # User deletes list
    elif request.method == "DELETE":
        list.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def api_tasks(request, list_id=None):
    if request.method == "GET":
        # If no list specified, retrieve all user tasks
        if list_id == None:
            tasks = Task.objects.filter(user=request.user)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        # else, retrieve user tasks from specified list
        else:
            tasks = Task.objects.filter(user=request.user).filter(list=list_id)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)

    # User creates task
    elif request.method == "POST":
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "DELETE"])
def api_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Retrieve task object data
    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    # User deletes (completes) task
    elif request.method == "DELETE":
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
