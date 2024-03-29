# from django.template import loader
from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.views.generic import FormView

from .forms import QuestionForm, RegisterForm
from .models import Test, Question, Answer, PartTest, QuestionType, Alternative


# todo пока что не удаляю
# def detail(request, test_id):
#     try:
#         test = Test.objects.get(pk=test_id)
#     except Test.DoesNotExist:
#         raise Http404("Теста не существует")
#     return render(request, 'polls/edit.html', {'question': test})

# todo разобраться с этим
# form = QuestionForm()
# return render(request, 'polls/addquest+.html', {'form': 'form'})


@login_required
def index(request):
    """Отображение начальной странички с тестами"""
    # latest_test_list = Test.objects.order_by('name')
    latest_test_list = Test.objects.filter(user=request.user, trash=False).order_by('name')
    context = {'latest_test_list': latest_test_list}
    return render(request, 'polls/index.html', context)
    # return render(request, 'polls/try.html', context)


@csrf_exempt
@require_POST
def add_test(request):
    """Добавление теста"""
    test_name = request.POST.get('test_name')
    test = Test.objects.create(name=test_name, user=request.user)
    part = PartTest.objects.create(test=test,
                                   number=1,
                                   name='Раздел 1')
    quest = Question.objects.create(name="Вопрос",
                                    number=0,
                                    type_question_id=1,
                                    part_test=part)
    Alternative.objects.create(question=quest,
                               text='Вариант 1')
    return render(request, 'polls/test_block.html', {'test': test})


# todo Когда добавлю корзину, эта функция будет удалять тест по истечении времени нахождения в корзине
# todo И нужно будет добавить функцию, которая будет менять trash на True
@csrf_exempt
@require_POST
def delete_test(request, form_id):
    """Удаление теста"""
    test = get_object_or_404(Test, pk=form_id)
    test.delete()
    return render(request, 'polls/edit.html')


@login_required
def edit(request, form_id):
    """Отображение странички с вопросами для формы"""
    test = get_object_or_404(Test, pk=form_id)
    # todo строка для отображения типов вопросов в селекте
    types_quest = get_list_or_404(QuestionType)
    # return render(request, 'polls/edit.html', {'test': test})
    return render(request, 'polls/edit.html', {'test': test, 'types_quest': types_quest})


@csrf_exempt
@require_POST
def add_part_test(request):
    """Добавление части теста (раздела)"""
    new_part_test = PartTest.objects.create(name=request.POST.get('part_test_name'),
                                            test_id=request.POST.get('test_id'),
                                            number=2,  # TODO
                                            )
    # todo Возможно буду тут использовать update_order_func()
    for quest in request.POST.getlist("quest_part_test[]"):
        pk = int(quest.split('_')[1])
        question = Question.objects.get(pk=pk)
        question.part_test = new_part_test
        question.save()
    return JsonResponse({'new_number': new_part_test.number, 'new_part_test_id': new_part_test.id})


@csrf_exempt
@require_POST
def add_question(request):
    """Добавление вопроса"""
    quest_name = request.POST.get('quest_name')
    part_test_id = request.POST.get('part_test_id')
    new_quest = update_order_func(request.POST.getlist("new_order[]"), quest_name, part_test_id)

    # todo почитай про httpResponse. Им тоже мог это сделать, указать просо что используется json
    # return JsonResponse({'new_number': new_quest.number, 'new_quest_id': new_quest.id, 'quest_name': new_quest.name, })
    return JsonResponse({'new_number': new_quest.number, 'new_quest_id': new_quest.id})


@csrf_exempt
@require_POST
def delete_question(request, quest_id):
    """Удаление вопроса"""
    update_order_func(request.POST.getlist("new_order[]"), None, None, quest_id)
    return render(request, 'polls/edit.html')
    # return JsonResponse({'new_number': new_quest.number, 'new_quest_id': new_quest.id})


@require_POST
def update_order(request, form_id):
    """
    Обновляет порядок вопросов в базе

    :param request:
    :param form_id: id формы(теста)
    :return:
    """
    update_order_func(request.POST.getlist("new_order[]"))
    # return JsonResponse({"status": "success"})
    return render(request, 'polls/edit.html')


# todo как-будто эту функцию нужно использовать при любом изменении в вопросах
# todo в цикле не варик, вспомни bulk_create()
# todo протестировать на запросы и время. Написать декоратор

# todo какой смысл проходить итерацию по вопросам которые идут до добавляемого, удаляемого? Но когда меняется порядок нужно идти по всем
def update_order_func(new_order, quest_name=None, part_test_id=None, quest_id=None):
    """Обновление порядка вопросов

    :param new_order: новый порядок вопросов формата {number: 'question_id'}
    :param quest_name: формулировка вопроса
    :param part_test_id:
    :param quest_id:
    :return: новый вопрос или None если вопрос не добавлялся
    """
    new_quest = None
    del_quest = False
    for number, quest in enumerate(new_order):
        if quest == 'new_id':
            new_quest = Question.objects.create(name=quest_name,
                                                number=number,
                                                part_test_id=part_test_id,
                                                type_question_id=3, )
        elif quest == 'del_id':
            quest = get_object_or_404(Question, pk=quest_id)
            quest.delete()
            number -= 1
            del_quest = True
        else:
            pk = int(quest.split('_')[1])
            question = Question.objects.get(pk=pk)
            question.number = number - 1 if del_quest else number
            question.save()
    return new_quest


def save_name_quest(request, form_id, quest_id):
    """
    Сохранение формулировки вопроса

    :param request:
    :param form_id: id формы(теста)
    :param quest_id: id вопроса
    """
    test = get_object_or_404(Test, pk=form_id)
    question = Question.objects.get(pk=quest_id)
    question.name = request.POST['name']
    question.save()
    return render(request, 'polls/edit.html', {'test': test})


@csrf_exempt
@require_POST
def add_alternative(request):
    """Добавление альтернативы"""
    quest_id = request.POST.get('quest_id')
    alternative_name = request.POST.get('alternative_name')
    new_alternative = Alternative.objects.create(question_id=quest_id,
                                                 text=alternative_name)
    # new_quest = update_order_func(request.POST.getlist("new_order[]"), quest_name, part_test_id)
    return JsonResponse({'new_alt_id': new_alternative.id})


@csrf_exempt
@require_POST
def delete_alternative(request):
    """Удаление альтернативы"""
    alt_id = request.POST.get('alt_id')
    alt = get_object_or_404(Alternative, pk=alt_id)
    alt.delete()
    # update_order_func(request.POST.getlist("new_order[]"), None, None, quest_id)
    return render(request, 'polls/edit.html')


# @csrf_exempt
@require_POST
def save_type_quest(request, form_id, quest_id, type_quest_id):
    """
    Сохранение типа вопроса

    :param request:
    :param form_id: id формы(теста)
    :param quest_id: id вопроса
    :param type_quest_id: id типа вопроса
    """
    # Если меняем чеки на радио или наоборот, то альтернативы оставляем

    test = get_object_or_404(Test, pk=form_id)
    question = Question.objects.get(pk=quest_id)
    type_quest = get_object_or_404(QuestionType, pk=type_quest_id)
    question.type_question = type_quest
    question.save()

    template_name = ''
    if type_quest_id == 1:
        template_name = 'radio.html'
    elif type_quest_id == 2:
        template_name = 'checkbox.html'
    elif type_quest_id == 3:
        template_name = 'text.html'
    return render(request, 'polls/type_templates/{}'.format(template_name), {'quest': question})


# # @csrf_exempt
# @require_POST
# def get_type_template(request):
#     """
#
#     :param request:
#     :return:
#     """
#     select_val = request.GET.get('selectVal')
#     template_name = ''
#     if select_val == '1':
#         template_name = 'radio.html'
#     elif select_val == '2':
#         template_name = 'checkbox.html'
#     elif select_val == '3':
#         template_name = 'text.html'
#
#     context = {}
#     return render(request, 'polls/type_templates/{}'.format(template_name), context)


def responses(request, form_id):
    """Отображение странички с ответами"""
    test = get_object_or_404(Test, pk=form_id)
    return render(request, 'polls/responses.html', {'test': test})


def settings(request, form_id):
    """Отображение странички с настройками"""
    return None


@login_required
def trash(request):
    """Отображение странички корзины"""
    # latest_test_list = Test.objects.order_by('name')
    latest_test_list = Test.objects.filter(user=request.user, trash=True).order_by('name')
    context = {'latest_test_list': latest_test_list}
    return render(request, 'polls/trash.html', context)


@login_required
def profile(request):
    """Отображение странички с профилем"""
    return render(request, 'polls/profile.html')


class RegisterView(FormView):
    form_class = RegisterForm
    template_name = "registration/register.html"
    success_url = "/polls"

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)


# todo эти 3 функции под удаление
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
