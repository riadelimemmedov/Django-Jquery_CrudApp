from django import forms
from django.forms import fields
from .models import Post

class PostForm(forms.ModelForm):#eger forms.Form yazsaydim onda sifirdan bir form yaradilir
    # title = forms.CharField(widget=forms.TextInput(attrs={
    #     'class':'form-control',
    # }))
    
    # body = forms.CharField(widget=forms.Textarea(attrs={
    #     'class':'form-control',
    #     'rows':'3'
    # }))
    
    class Meta:
        model = Post
        fields = ['title','body']