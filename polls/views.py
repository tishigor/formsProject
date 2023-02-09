# from django.http import HttpResponse
# from django.template import loader
from django.http import HttpResponse
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from .models import Test, Question, Answer, PartTest


# Create your views here.


def index(request):
    latest_test_list = Test.objects.order_by('name')
    context = {'latest_test_list': latest_test_list}
    return render(request, 'polls/indexNew.html', context)


def edit(request, form_id):
    """Получает объект теста для странички"""
    test = get_object_or_404(Test, pk=form_id)
    quest_list = Question.objects.filter(part_test__test_id=test.id)
    return render(request, 'polls/detail.html', {'test': test})


def save_quest(request, form_id, quest_id):
    """сохраняет имя вопроса"""
    test = get_object_or_404(Test, pk=form_id)
    question = Question.objects.get(pk=quest_id)
    question.name = request.POST['name']
    question.save()
    return render(request, 'polls/detail.html', {'test': test})


# def detail(request, test_id):
#     try:
#         test = Test.objects.get(pk=test_id)
#     except Test.DoesNotExist:
#         raise Http404("Теста не существует")
#     return render(request, 'polls/detail.html', {'question': test})

def detail(request, question_id):
    """Получает объект вопроса для странички"""
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/detail.html', {'question': question})


def add_test(request):
    name = 'Тест3'
    test = Test.objects.create(name=name,
                               type_test=1,
                               anonymous=1,
                               added_by_ou=1)
    test.save()
    return HttpResponse('Тест "%s" добавлен.' % name)


def add_guest(request):
    name = ''
    quest = Question.objects.create()
    quest.save()
    return HttpResponse('quest "%s" добавлен.' % name)


def add_answ(request):
    quest = Question.objects.get(pk=1)
    answ = Answer.objects.create(question=quest,
                                 open_ans='Ответ4')
    answ.save()
    return HttpResponse('Ответ "%s" добавлен.' % answ)


def add_part(request):
    test = Test.objects.get(pk=1)
    part = PartTest.objects.create(test=test,
                                   number=1,
                                   name='Раздел 1')
    part.save()
    return HttpResponse('Ответ "%s" добавлен.' % part)
