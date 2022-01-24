from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from profiles.models import Profile
from django.contrib import messages
from .forms import *
from .models import *
# Create your views here.

def post_list_and_create(request):
    # posts = Post.objects.all()
    form = PostForm(request.POST or None)

    if request.is_ajax():
        if form.is_valid():
            profileauthor = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = profileauthor
            instance.save()
            return JsonResponse({
                #?instance = Post Model
                'title':instance.title,
                'body':instance.body,
                'author':instance.author.user.username,
                'id':instance.id
            })

    context = {
        'form': form,
    }

    return render(request, 'posts_proj/main.html', context)


def post_detail(request,pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()
    
    context = {
        'obj':obj,
        'form':form
    }
    
    return render(request,'posts_proj/detail.html',context)





#!JS terefi

def hello_worls_view(request):
    return JsonResponse({'text': 'Hello from hello_world_view from DJANGO'})


def load_post_data_view(request, num_posts):
    if request.is_ajax():

        posts = Post.objects.all()

        visible = 3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()

        data = []
        for post in posts:
            item = {
                'id': post.id,
                'title': post.title,
                'body': post.body,
                'liked': True if request.user in post.liked.all() else False,
                'like_count': post.like_count,
                'author': post.author.user.username,
            }
            data.append(item)
        return JsonResponse({'data': data[lower:upper], 'size': size})

def post_detail_data_view(request,pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id':obj.id,
        'title':obj.title,
        'body':obj.body,
        'author':obj.author.user.username,
        'logged_in':request.user.username
    }
    return JsonResponse({'data':data})


def like_unlike_post(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)

        if request.user in obj.liked.all():
            likedBtn = False
            obj.liked.remove(request.user)
        else:  # eger like elememisemse
            likedBtn = True
            obj.liked.add(request.user)
        return JsonResponse({'likedBtn': likedBtn, 'count': obj.like_count})


#!Post proses Update and Delete post

def update_post(request,pk):
    obj = Post.objects.get(pk=pk)
    if request.is_ajax():
        #?Js den gelendir bu POST request vasitesile AJAXDAN
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')
        obj.title = new_title
        obj.body = new_body
        obj.save()
        
        return JsonResponse({
            'title':new_title,
            'body':new_body
        })

def delete_post(request,pk):
    obj = Post.objects.get(pk=pk)
    if request.is_ajax():
        obj.delete()
        messages.add_message(request,messages.INFO,'Post Has Benn Successfully Deleted')
        return JsonResponse({})
