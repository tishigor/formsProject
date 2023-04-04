from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import *


class QuestionForm(forms.ModelForm):
    def __int__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['type_question'].empty_label = 'Тип не выбран'

    class Meta:
        model = Question
        fields = ['name', 'type_question']
        widgets = {
            'number': forms.TextInput(attrs={'class': 'form-input'}),
            'name': forms.Textarea(attrs={'cols': 50, 'rows': 10}),
        }


class AddPostForm(forms.ModelForm):
    def __int__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['type_question'].empty_label = 'Тип не выбран'

    class Meta:
        model = Question
        fields = '__all__'
        widgets = {
            'number': forms.TextInput(attrs={'class': 'form-input'}),
            'name': forms.Textarea(attrs={'cols': 50, 'rows': 10}),
        }


class RegisterForm(UserCreationForm):
    model = UserCreationForm
    # class Meta(UserCreationForm.Meta):
    #     model = User