# coding: utf-8

from django.db import models
from django.utils.safestring import mark_safe
from django.utils import timezone


ANON_TYPES = (
    (0, 'Не анонимный'),
    (1, 'Анонимный'),
    (2, 'Конфиденциальный')
)

COMP = (
    (0, 'Письменный'),
    (1, 'Компьютерный'),
    (2, 'Компьютерный и письменный'),
)

METHOD_OF_SEL = (
    (1, 'По порядку'),
    (2, 'Случайным образом'),
)

PAV_TEST_STATUS_CHOICES = (
    (1, 'Не определен'),
    (2, 'Не завершил'),
    (3, 'Завершил'),
    (4, 'Отказ'),
    (5, 'На больничном'),
    (6, 'На соревнованиях/сборах'),
    (7, 'Отчислен'),
    (8, 'Не посещает ОУ (без уважительной причины)'),
    # (9, 'Другое'),
    (99, 'Иная причина')
)

TYPE_FACTOR_CHOICE = (
    (1, 'по баллам'),
    (2, 'по альтернативам и баллам'),
)

TYPE_METHOD = (
    (1, 'Психологические'),
    (2, 'Метапредметные'),
    (3, 'Предметные'),
    (4, 'Анкеты'),
    (6, 'ЕМ-СПТ'),
    (7, 'Вариант теста')
)

TYPE_TABLER = (
    ('', 'Выбери пункт ->'),
    (1, 'Шапка'),
    # (2, 'Шапка лево'),
    # (3, 'Шапка право'),
    (4, 'Альтернатива'),
)

TYPE_INPUT_IN_TEXT_QUESTION = (
    ('', 'Выбери пункт ->'),
    (1, 'Шапка'),
    # (2, 'Шапка лево'),
    # (3, 'Шапка право'),
    (4, 'Альтернатива'),
)

TYPE_TEST_CHOICE = (
    (1, 'Опрос учащегося'),
    (2, 'Опрос педагогов'),
)

optional_field = {'blank': True, 'null': True}  # Для необязательных полей
required_field = {'blank': False, 'null': False}  # Для обязательных полей


# Модель для методики
class Test(models.Model):
    name = models.CharField(verbose_name='Название методики', max_length=100, default='Новая форма', **optional_field)
    desc = models.TextField(verbose_name='Описание методики', **optional_field)
    created = models.DateTimeField(verbose_name='Создана', auto_now_add=True, editable=False, **optional_field)
    changed = models.DateTimeField(verbose_name='Последняя правка', auto_now=True, editable=False, **optional_field)
    type_test = models.SmallIntegerField(verbose_name='Тип опроса', choices=TYPE_TEST_CHOICE, **required_field, default=1)  # default-Опрос учащегося
    anonymous = models.SmallIntegerField(verbose_name='Анонимность', choices=ANON_TYPES, default=0, **required_field)  # default-Не анонимный
    added_by_ou = models.BooleanField(verbose_name='Добавлено ОУ', default=True, **required_field)
    variant = models.ManyToManyField('Test', verbose_name='Вариант')

    def __str__(self):
        return '{}:{}'.format(self.pk, self.name)

    class Meta:
        db_table = 'form_test'
        verbose_name = 'Психологический тест'
        verbose_name_plural = 'Психологические тесты'


class PartTest(models.Model):
    created = models.DateTimeField(verbose_name='Создана', auto_now_add=True, editable=False, **optional_field)
    changed = models.DateTimeField(verbose_name='Последняя правка', auto_now=True, editable=False, **optional_field)
    test = models.ForeignKey(Test, verbose_name='Тест', null=False, on_delete=models.CASCADE)
    target_n_quest = models.PositiveIntegerField(verbose_name='Сколько вопросов показывать', **optional_field, default=0)
    method_of_sel = models.IntegerField(verbose_name='Как выбрать нужное кол-во вопросов', choices=METHOD_OF_SEL, default=1)  # default-По порядку
    text = models.TextField(verbose_name='Текст части', **optional_field)
    number = models.IntegerField(verbose_name='Номер части', **required_field, default=0)
    name = models.CharField(max_length=100, verbose_name='Название части', **required_field)

    def __str__(self):
        return '{}: {}'.format(self.pk, self.name)

    class Meta:
        db_table = 'form_part_test'
        verbose_name = 'Часть теста'
        verbose_name_plural = 'Части теста'


class QuestionType(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название типа вопроса')
    function = models.CharField(max_length=200, **optional_field, verbose_name='Функция')

    def __str__(self):
        return '{} {}'.format(self.pk, self.name)

    class Meta:
        db_table = 'form_type_question'
        verbose_name = 'Тип вопроса'
        verbose_name_plural = 'Типы вопроса'


class Question(models.Model):
    name = models.TextField(verbose_name='Формулировка вопроса', **optional_field)
    created = models.DateTimeField(verbose_name='Создана', auto_now_add=True, editable=False, **optional_field)
    changed = models.DateTimeField(verbose_name='Последняя правка', auto_now=True, editable=False, **optional_field)
    number = models.CharField(verbose_name='Номер вопроса', max_length=11)
    image = models.ImageField(verbose_name='Изображение к вопросу', upload_to="images\psy_questions\\", default='', **optional_field)
    type_question = models.ForeignKey(QuestionType, verbose_name='Тип вопроса', **optional_field, on_delete=models.CASCADE)
    part_test = models.ForeignKey(PartTest, verbose_name='Часть теста', blank=False, null=False, on_delete=models.CASCADE)

    def _get_question_description(self):
        description = Question.objects.get(id=self.id).name
        return mark_safe(description)

    def _get_question_interface(self):
        try:
            interface = Question.objects.get(id=self.id).type_question__id
            for i in QuestionType.objects.filter():
                if int(interface) == i.id:
                    name = i.name
            return mark_safe(name)
        except Exception:
            pass

    vopros = property(_get_question_description)
    type_question_description = property(_get_question_interface)

    def __str__(self):
        return '{}'.format(self._get_question_description())

    class Meta:
        db_table = 'form_question'
        verbose_name = 'Ворпос'
        verbose_name_plural = 'Вопросы'


class Alternative(models.Model):
    created = models.DateTimeField(verbose_name='Создана', auto_now_add=True, editable=False, **optional_field)
    changed = models.DateTimeField(verbose_name='Последняя правка', auto_now=True, editable=False, **optional_field)
    question = models.ForeignKey(Question, verbose_name='Вопрос', **required_field, on_delete=models.CASCADE)
    text = models.CharField(verbose_name='Формулировка', max_length=2000, **optional_field)
    number = models.CharField(verbose_name='Номер', max_length=11, **optional_field)
    tabler = models.IntegerField(verbose_name='Шапка/Альтернатива', **optional_field)
    min_range = models.IntegerField(verbose_name='Минимум', **optional_field)
    max_range = models.IntegerField(verbose_name='Максимум', **optional_field)
    min_name = models.CharField(verbose_name='Название минимума', max_length=1000, **optional_field)
    max_name = models.CharField(verbose_name='Название максимума', max_length=1000, **optional_field)
    related_question = models.CharField(verbose_name='связанный вопрос', max_length=11, **optional_field)  # новое

    def __str__(self):
        return '{} {}'.format(self.pk, self.number)

    class Meta:
        db_table = 'form_alternative'
        verbose_name = 'Альтернатива'
        verbose_name_plural = 'Альтернативы'


class Answer(models.Model):
    created = models.DateTimeField(verbose_name='Создана', auto_now_add=True, editable=False, blank=True, null=True)
    changed = models.DateTimeField(verbose_name='Последняя правка', auto_now=True, editable=False, blank=True, null=True)
    question = models.ForeignKey(Question, verbose_name='Вопрос', on_delete=models.CASCADE)  # К удалению
    alternative = models.ForeignKey(Alternative, verbose_name='Альтарнатива', null=True, on_delete=models.CASCADE)  # Новое
    value = models.CharField(max_length=6000, verbose_name='Ответ', blank=True, null=True)  # К удалению
    open_ans = models.CharField(max_length=6000, verbose_name='Ответ на открытый вопрос', blank=True, null=True)  # Новое

    def __str__(self):
        return '{}'.format(self.open_ans)
        # return '{}: {}'.format(self.alternative.question.pk, self.open_ans)

    class Meta:
        # Имя таблицы в БД
        db_table = 'form_answer'
        verbose_name = 'Ответ на вопрос'
        verbose_name_plural = 'Ответы на вопросы'
