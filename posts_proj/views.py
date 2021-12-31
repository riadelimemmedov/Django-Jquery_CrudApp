from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from profiles.models import Profile
from django.contrib import messages
from .forms import *
from .models import *
# Create your views here.



#!Yadda Saxla Artig html donenn seyfede hemcinin JsonResponsede done bilersen

def post_list_and_create(request):
    # posts = Post.objects.all()
    form = PostForm(request.POST or None)

    # birinci ajax sertini yoxla sonra validlik sertini yoxla
    if request.is_ajax():
        if form.is_valid():
            profileauthor = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            # burda instance Post modelime beraberdir ele yeni ona gore instance.save() yazmaliyam
            instance.author = profileauthor
            instance.save()
            return JsonResponse({#Js hissesine gonderecek
                #?instance = Post modeline
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

        visible = 3  # yeni ilk defe 3 post gostersin
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()
        # data = serializers.serialize('json',posts)
        # ?Ikinci Bir Yol

        data = []
        for post in posts:
            item = {
                'id': post.id,
                'title': post.title,
                'body': post.body,
                # yeni giris eden istifadeci postu beyenenler siyahisinda varsa True,yoxdursa else donder
                'liked': True if request.user in post.liked.all() else False,
                # yeni her bir postun like sayini gosteren funksiyani islet her bir post ucun
                'like_count': post.like_count,
                'author': post.author.user.username,
            }
            # bu yol ile datalari gondermek daha qesengdir amma ferq etmir seriliazer ilede gonderib Js terefinde JSON.PARSE edib for ile yazdira bilersen eyni seylerdir
            data.append(item)
        # bruda string icindeki datani isare edeciyik JsonResponseden gelen deyeri almga ucun,cunki biz key deyerini gonderirik ve o bize valuesini verir
        return JsonResponse({'data': data[lower:upper], 'size': size})

def post_detail_data_view(request,pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id':obj.id,
        'title':obj.title,
        'body':obj.body,
        'author':obj.author.user.username,
        # 'logged_in':True if request.user.is_authenticated else False, => Bu kod istifadecin giris edib etmemeyini gosterir
        'logged_in':request.user.username
    }
    return JsonResponse({'data':data})


def like_unlike_post(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)

        if request.user in obj.liked.all():  # eger istifadeci bu sekili like edibse
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
        
    #Burda ise POST dan gelen deyerleri JS hissesine otururem,yeni update olanda input yerlerine ne yazmisamsa onu JS terefine oturub Ajax vasitesile update edecem
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
