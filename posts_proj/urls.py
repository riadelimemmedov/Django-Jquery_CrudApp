from django.urls import path
from .views import *

app_name = 'posts'

urlpatterns = [
    path('',post_list_and_create,name='main-board'),
    path('hello-world/',hello_worls_view,name='hello-world'),
    path('data/<int:num_posts>/',load_post_data_view,name='posts-data'),
    path('like-unlike/',like_unlike_post,name='likeunlike'),
    path('<pk>/',post_detail,name='post-detail'),
    path('<pk>/data/',post_detail_data_view,name='post-detail-data'),
    path('<pk>/update/',update_post,name='updatepost'),
    path('<pk>/delete/',delete_post,name='deletepost')
]



