from django.db import models
from profiles.models import Profile
from django.contrib.auth.models import User

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    liked = models.ManyToManyField(User,blank=True)
    author = models.ForeignKey(Profile,on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.title)
    
    @property
    def like_count(self):
        return self.liked.all().count()

    class Meta:
        ordering = ['-created']