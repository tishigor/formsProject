# from django.http import HttpResponse
# from django.template import loader
from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.views.generic import FormView

from .forms import QuestionForm, RegisterForm
from .models import Test, Question, Answer, PartTest, QuestionType


# todo пока что не удаляю
# def detail(request, test_id):
#     try:
#         test = Test.objects.get(pk=test_id)
#     except Test.DoesNotExist:
#         raise Http404("Теста не существует")
#     return render(request, 'polls/edit.html', {'question': test})

@login_required
def index(request):
    """Отображение начальной странички с тестами"""
    # latest_test_list = Test.objects.order_by('name')
    latest_test_list = Test.objects.filter(user=request.user, trash=False).order_by('name')
    context = {'latest_test_list': latest_test_list}
    return render(request, 'polls/index.html', context)
    # return render(request, 'polls/try.html', context)


@login_required
def edit(request, form_id):
    """Отображение странички с вопросами для формы"""
    test = get_object_or_404(Test, pk=form_id)
    types_quest = get_list_or_404(QuestionType)
    return render(request, 'polls/edit.html', {'test': test, 'types_quest': types_quest})


def save_quest(request, form_id, quest_id):
    """
    Сохраняет формулировку вопроса

    :param request:
    :param form_id: id формы(теста)
    :param quest_id: id вопроса
    """
    test = get_object_or_404(Test, pk=form_id)
    question = Question.objects.get(pk=quest_id)
    question.name = request.POST['name']
    question.save()
    return render(request, 'polls/edit.html', {'test': test})


def save_type_quest(request, form_id, quest_id, type_quest_id):
    """
    Сохраняет тип вопроса

    :param request:
    :param form_id: id формы(теста)
    :param quest_id: id вопроса
    :param type_quest_id: id типа вопроса
    """
    test = get_object_or_404(Test, pk=form_id)
    question = Question.objects.get(pk=quest_id)
    type_quest = get_object_or_404(QuestionType, pk=type_quest_id)
    question.type_question = type_quest
    question.save()
    return render(request, 'polls/edit.html', {'test': test})


def get_type_template(request):
    """

    :param request:
    :return:
    """
    select_val = request.GET.get('selectVal')
    template_name = ''
    if select_val == '1':
        template_name = 'radio.html'
    elif select_val == '2':
        template_name = 'checkbox.html'
    elif select_val == '3':
        template_name = 'text.html'

    context = {}
    return render(request, 'polls/type_templates/{}'.format(template_name), context)


@require_POST
def update_order(request, form_id):
    """
    Обновляет порядок вопросов в базе

    :param request:
    :param form_id: id формы(теста)
    :return:
    """
    new_order = request.POST.getlist("new_order[]")  # получаем новый порядок вопросов из Ajax-запроса
    for i, quest in enumerate(new_order):
        pk = int(quest.split('_')[1])
        question = Question.objects.get(pk=pk)
        question.number = i
        question.save()
    # return JsonResponse({"status": "success"})
    return render(request, 'polls/edit.html')


# todo решить как обрабатывать ошибки
@csrf_exempt
def add_test(request):
    if request.method == 'POST':
        test_name = request.POST.get('test_name')
        test = Test(name=test_name, user=request.user)
        test.save()
        return render(request, 'polls/test_block.html', {'test': test})
    else:
        return JsonResponse({'error': 'Invalid request method'})

# todo решить как обрабатывать ошибки
@csrf_exempt
def delete_test(request, form_id):
    """Удаление теста"""
    if request.method == 'POST':
        test = get_object_or_404(Test, pk=form_id)
        test.delete()
        return render(request, 'polls/edit.html')
    else:
        return JsonResponse({'error': 'Invalid request method'})



# @csrf_exempt
def add_question(request):
    # return HttpResponse('добавление вопроса')
    form = QuestionForm()
    return render(request, 'polls/addquest+.html', {'form': form})


def add_answer(request):
    quest = Question.objects.get(pk=1)
    answ = Answer.objects.create(question=quest,
                                 open_ans='Ответ4')
    return HttpResponse('Ответ "%s" добавлен.' % answ)


def add_part(request):
    test = Test.objects.get(pk=1)
    part = PartTest.objects.create(test=test,
                                   number=1,
                                   name='Раздел 1')
    return HttpResponse('Ответ "%s" добавлен.' % part)


def add_type_quest(request):
    type_quest = QuestionType.objects.create(name='Текст',
                                             function='text')
    return HttpResponse('Ответ "%s" добавлен.' % type_quest)


def responses(request, form_id):
    """Отображение странички с ответами"""
    test = get_object_or_404(Test, pk=form_id)
    return render(request, 'polls/responses.html', {'test': test})


def settings(request, form_id):
    """Отображение странички с настройками"""
    return None


@login_required
def profile(request):
    return render(request, 'polls/profile.html')


class RegisterView(FormView):
    form_class = RegisterForm
    template_name = "registration/register.html"
    success_url = "/polls"

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)


@login_required
def trash(request):
    """Отображение корзины"""
    # latest_test_list = Test.objects.order_by('name')
    latest_test_list = Test.objects.filter(user=request.user, trash=True).order_by('name')
    context = {'latest_test_list': latest_test_list}
    return render(request, 'polls/trash.html', context)
