from django.urls import path

from . import views

urlpatterns = [
    # начальная страница
    path('', views.index, name='index'),
    # редактор теста
    path('<int:form_id>/', views.edit, name='edit'),
    path('<int:form_id>/<int:quest_id>/', views.save_quest, name='save_quest'),  # сохранение формулировки
    path('<int:form_id>/<int:quest_id>/<int:type_quest_id>', views.save_type_quest, name='save_type_quest'),
    path('<int:form_id>/update_order/', views.update_order, name='update_order'),  # изменение порядка вопросов
    path('get_template/', views.get_type_template, name='get_type_template'),  #

    # ответы теста
    path('<int:form_id>/', views.responses, name='responses'),

    # todo удалить в релизе
    path('add_quest', views.add_quest, name='add_quest'),
    path('add_test', views.add_test, name='add_test'),
    path('add_answ', views.add_answ, name='add_answ'),
    path('add_part', views.add_part, name='add_part'),
    path('add_type_quest', views.add_type_quest, name='add_type_quest'),
]
