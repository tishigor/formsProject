from django.urls import path

from . import views

urlpatterns = [
    # ex: /polls/
    path('', views.index, name='index'), #начальная страница
    path('<int:form_id>/', views.edit, name='edit'), #редактор формы
    path('<int:form_id>/<int:quest_id>/', views.save_quest, name='save_quest'), #отправка на сервак вопроса
    path('<int:form_id>/<int:quest_id>/<int:type_quest_id>', views.save_type_quest, name='save_type_quest'),

    # ex: /polls/5/
    # path('<int:question_id>/', views.edit, name='detail'),
    path('add_test', views.add_test, name='add_test'),
    path('add_quest', views.add_quest, name='add_quest'), #пробую с формами чето поделать
    path('add_answ', views.add_answ, name='add_answ'),
    path('add_part', views.add_part, name='add_part'),
    path('add_type_quest', views.add_type_quest, name='add_type_quest'),
]
