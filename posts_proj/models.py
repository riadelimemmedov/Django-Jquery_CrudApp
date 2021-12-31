from django.db import models
from profiles.models import Profile
from django.contrib.auth.models import User

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    liked = models.ManyToManyField(User,blank=True)#yeni sekili sekili bir nefer deyilse coxlu insanlar like ede biler,hemcinin bu insanlar basqa sekilleride like ede bilerler yeni sekil cox insan cox coxa cox iliski =>ManyToManyField
    author = models.ForeignKey(Profile,on_delete=models.CASCADE)#Postu yazan insan ele ozu bir Profildir,ona gore profil modelini daxil edtik authot yerine
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.title)
    
    @property#Bu funksiyanin ustufen @property decoratorunun yazilmasindaki sebeb @property decorator verilen funksiyani deyiskene cevirir yeni biz funkisyani cagranda funksiyaadi() seklinde deyilde sadece funksiyaadi seklinde yaza bilerik
    def like_count(self):#eger Pythonda class icinde bir funksiya yazirsasan o funksiyainin ilk parametresi mutleq self olmalidir,hemcinin funksiyani cagiranda class icinde self.funksiyaadi seklinde cagirmalisan
        return self.liked.all().count()

    class Meta:
        ordering = ['-created']#yeni en son yazilan postlar biriinci gorunsun 