// todo крч для хранения csrf токена
// https://django.fun/ru/docs/django/4.1/howto/csrf/#:~:text=%D0%92%D1%8B%20%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5%20%D0%BF%D1%80%D0%B8%D0%BE%D0%B1%D1%80%D0%B5%D1%81%D1%82%D0%B8%20%D1%82%D0%BE%D0%BA%D0%B5%D0%BD%20%D1%81%D0%BB%D0%B5%D0%B4%D1%83%D1%8E%D1%89%D0%B8%D0%BC%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%BC%3A
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');


$('.td-site__section-one').hover(
    function () {
        $('.td-site__title', this).css('color', '#f4846b');
    },

    function () {
        $('.td-site__title', this).css('color', 'black');
    }
)


$('.block').hover(
    function () {
        $('.quest_upper', this).css('opacity', '1');
    },
    function () {
        $('.quest_upper', this).css('opacity', '0');
    }
)


// Запрос при изменении нумерации(при перетаскивании)
$(function () {
    $(".td-sites-grid").sortable({
        connectWith: ".td-sites-grid",
        handle: ".quest_upper",
        // axis: "y",
        cursor: "n-resize",
        revert: 400, // Плавная анимация возвращения сорт. элемента на свое место
        // cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder",

        stop: function (event, ui) {
            let new_order = $(this).sortable("toArray"); // получаем новую последовательность вопросов
            $.ajax({
                type: "POST",
                url: "/polls/" + $('.td-form-col__cell').attr('form_id') + "/update_order/",
                data: {
                    new_order: new_order,
                    csrfmiddlewaretoken: csrftoken,
                },
                success: function () {
                    // todo сделать индикатор отправки запроса на сохранение и успешное сохранение
                    // alert("Порядок вопросов изменен!"); // оповещение об успешном изменении порядка
                }
            });
        }
    })
});


// Запрос при изменении кастомного поля для ввода
// $('.td-quest-col__header').keyup(delay(function (e) {
$('.td-quest__name').keyup(delay(function (e) {
    $.ajax({
        type: 'POST',
        url: '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + $(this).parent()[0].getAttribute('quest_id') + '/',
        // $(this).parent().getAttribute('quest_id')
        data: {
            name: this.innerText,
            csrfmiddlewaretoken: csrftoken,
        },
        beforeSend: function () {
            console.log('beforeSend');
        },
        success: function (data) {
            console.log('success');
            // alert(data);
        },
        onerror: function (data) {
            console.log('onerror');
            alert(data);
        }
    });
}, 500));


function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}


// Запрос при изменении select
// todo не удаляет старый, не добавляет новый. Исправить!
$(document).ready(function () {
    $('select').change(function (e) {
        e.preventDefault();
        // var form = $(this);
        // var data = form.serialize();
        $.ajax({
            type: 'POST',
            url: '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + $(this).parent().parent()[0].getAttribute('quest_id') + '/' + this.value,
            data: {
                // name: this.innerText,
                // type_quest: this.value,
                csrfmiddlewaretoken: csrftoken,
            },
            success: function (response) {
                console.log(response);
            },
            error: function (response) {
                console.log(response);
            }
        });

        let selectVal = $(this).val();
        let block = $(this).closest('.td-quest-col__header');
        let url = '/polls/get_template/';

        $.ajax({
            method: 'GET',
            url: url,
            data: {
                selectVal: selectVal
            },
            success: function (response) {
                block.find('.template-container').remove();
                block.find('.td-site__alt').append(response);
            }
        });
    });
});


// todo это будет в success после добавления в БД. Переделаю как будет время
//добавление блока с вопросом
$('button').on('click', addQuestBlock);

function addQuestBlock() {
    // Находим последний элемент с классом "td-quest-col__header"
    let lastHeader = $(".td-sites-grid .td-quest-col__header").last();
    // Клонируем этот элемент
    let clonedHeader = lastHeader.clone();
    // Ищем внутри клонированного элемента элемент с классом "td-quest__name" и меняем его текст на "Новый вопрос"
    clonedHeader.find(".td-quest__name").text("Новый вопрос");
    // Ищем внутри клонированного элемента элемент с атрибутом "quest_id" и меняем его значение на значение оригинала + 1
    let originalQuestId = lastHeader.attr("quest_id");
    clonedHeader.attr("quest_id", parseInt(originalQuestId) + 1);
    // Ищем внутри клонированного элемента элемент "select" и устанавливаем первый вариант выбора
    clonedHeader.find("select").prop("selectedIndex", 0);
    // Вставляем клонированный элемент после оригинала
    clonedHeader.insertAfter(lastHeader).hide().fadeIn();

    // todo Расскомментить и дописать! добавление в базу
    // addQuestionQuery($new_block_quest)
}


function addQuestionQuery(quest_block) {
    url = '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + quest_block.getAttribute('quest_id') + '/'

    $.ajax({
        type: 'POST',
        url: '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + this.getAttribute('quest_id') + '/',
        // todo по идее если вопрос пустой то сохраняем только порядковый номер. Если вопрос пустой, то defaultValue="Вопрос"
        data: {
            name: quest_block.innerText,
            csrfmiddlewaretoken: csrftoken,
        },
        beforeSend: function () {
            console.log('beforeSend');
        },
        success: function (data) {
            console.log('success');
            // alert(data);
        },
        onerror: function (data) {
            console.log('onerror');
            alert(data);
        }
    });
}


// Вкладки
$(document).ready(function () {
    $(".head a").click(function () {
        // var tab = $(this).data("tab");
        let tabId = $(this).attr('href');
        $(".td-form-col").hide();
        $(tabId).show();
        $(".head a").removeClass("selected");
        $(this).addClass("selected");
    });
    $("#edit").show();
    // $(".head a[href='#FormEditor']").addClass("selected");
});


//добавление теста
$(document).ready(function () {
    $('#add-test-button').click(function () {
        $.ajax({
            url: '/polls/add_test',
            type: 'POST',
            data: {test_name: 'Новый тест'},
            success: function (response) {
                // Добавляем новый элемент на страницу с помощью jQuery
                let last_block = $("#projectssortable .td-sites-grid__cell").last();
                let block_test = $(response).hide()
                last_block.before(block_test.fadeIn());
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            }
        });
    });
});


//удаление теста
$(document).ready(function () {
    $('.td-sites-grid').on('click', '.td-site__delete', function () {
        let form_id = $(this).attr('form_id');
        let del_block = $(this)
        $.ajax({
            url: `/polls/${form_id}/delete_test`,
            type: 'POST',
            data: {},
            success: function (response) {
                // Удаляем блок теста со страницы с помощью jQuery
                del_block.closest('.td-sites-grid__cell').remove();
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            }
        });
    });
});