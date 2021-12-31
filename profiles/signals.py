from django.db.models.signals import post_save
from django.contrib.auth.models import User
from .models import Profile
from django.dispatch import receiver

@receiver(post_save,sender=User)#yeni USER modeli gonderilecek ve avtomatik Profile yaranacag,yeniki biz hesab acan kimi bize bir Profil verecek
def post_save_create_profile(sender,instance,created,*args,**kwargs):
    print('Sender ', sender)
    print('Instance ', instance)
    print('Created ', created)
    
    if created:
        Profile.objects.create(user=instance)