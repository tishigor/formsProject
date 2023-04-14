from django.urls import path

from . import views
from .views import RegisterView

urlpatterns = [
    # начальная страница
    path('', views.index, name='index'),
    # редактор теста
    path('<int:form_id>/', views.edit, name='edit'),
    path('<int:form_id>/<int:quest_id>/', views.save_quest, name='save_quest'),  # сохранение формулировки
    path('<int:form_id>/<int:quest_id>/<int:type_quest_id>', views.save_type_quest, name='save_type_quest'),
    path('<int:form_id>/update_order/', views.update_order, name='update_order'),  # изменение порядка вопросов
    path('get_template/', views.get_type_template, name='get_type_template'),  #
    path('add_test', views.add_test, name='add_test'),
    path('<int:form_id>/delete_test', views.delete_test, name='delete_test'),  #  удаление теста


    # ответы теста
    path('<int:form_id>/', views.responses, name='responses'),

    # настройки теста
    path('<int:form_id>/', views.settings, name='settings'),

    # профиль
    path('profile/', views.profile, name='profile'),
    path('register/', RegisterView.as_view(), name='register'),

    # корзина
    path('trash/', views.trash, name='trash'),

    # todo удалить в релизе
    path('add_question', views.add_question, name='add_question'),
    path('add_answer', views.add_answer, name='add_answer'),
    path('add_part', views.add_part, name='add_part'),
    path('add_type_quest', views.add_type_quest, name='add_type_quest'),
]
