from django.urls import path

from . import views
from .views import RegisterView

urlpatterns = [
    # начальная страница
    path('', views.index, name='index'),
    path('add_test', views.add_test, name='add_test'),  # добавление теста
    path('<int:form_id>/delete_test', views.delete_test, name='delete_test'),  # удаление теста
    # редактор теста
    path('<int:form_id>/', views.edit, name='edit'),
    path('add_question/', views.add_question, name='add_question'),  # добавление вопроса
    path('<int:form_id>/update_order/', views.update_order, name='update_order'), # изменение порядка вопросов. Вызывается при перемещении блоков вопросов
    path('<int:form_id>/<int:quest_id>/', views.save_name_quest, name='save_name_quest'),  # сохранение формулировки
    path('<int:form_id>/<int:quest_id>/<int:type_quest_id>', views.save_type_quest, name='save_type_quest'), # сохранение типа вопроса
    path('get_template/', views.get_type_template, name='get_type_template'),  # получение шаблонов для блока вопроса todo еще предстоит повозиться

    # ответы теста
    path('<int:form_id>/', views.responses, name='responses'),

    # настройки теста
    path('<int:form_id>/', views.settings, name='settings'),

    # корзина
    path('trash/', views.trash, name='trash'),

    # профиль
    path('profile/', views.profile, name='profile'),
    path('register/', RegisterView.as_view(), name='register'),


    # todo эти 3 функции под удаление
    path('add_answer', views.add_answer, name='add_answer'),
    path('add_part', views.add_part, name='add_part'),
    path('add_type_quest', views.add_type_quest, name='add_type_quest'),
]
