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
        // $(this).addClass('td-sites-grid__more_visible')
        // $(this).addClass('td-sites-more_visible')
        $('.td-site__title', this).css('color', '#f4846b');
    },

    function () {
        // $(this).removeClass('td-sites-grid__more_visible')
        // $(this).removeClass('td-sites-more_visible')
        $('.td-site__title', this).css('color', 'black');
    }
)

// для таскалки
// $('.td-quest-col__cell').hover(

$('.block').hover(
    function () {
        $('.quest_upper', this).css('opacity', '1');

    },
    function () {
        $('.quest_upper', this).css('opacity', '0');
    }
)

// style="display: none"

$(function () {
    $(".td-sites-grid").sortable({
        connectWith: ".td-sites-grid",
        handle: ".quest_upper",
        // axis: "y",
        cursor: "n-resize",
        revert: 400, // плавная анимация возвращения сорт. элемента на свое место
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
    // $(".portlet")
    //     .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
    //     .find(".portlet-header")
    //     .addClass("ui-widget-header ui-corner-all")
    //     .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    // $(".portlet-toggle").on("click", function () {
    //     var icon = $(this);
    //     icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
    //     icon.closest(".portlet").find(".portlet-content").toggle();
    // });
});




// $(function () {
//     $(".td-sites-grid").sortable({
//         connectWith: ".td-sites-grid",
//         // handle: ".page-child__drag-handle",
//         axis: "y",
//         cursor: "n-resize",
//         revert: 400, //плавная анимация возвращения сорт. элемента на свое место
//         // cancel: ".portlet-toggle",
//         placeholder: "portlet-placeholder",
//     });
// });


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

// Example usage:

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


$(document).ready(function() {
    $('select').change(function(e) {
        e.preventDefault();
        // var form = $(this);
        // var data = form.serialize();
        $.ajax({
            type: 'POST',
            url: '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + $(this).parent().parent()[0].getAttribute('quest_id') + '/'+this.value,
            data: {
                // name: this.innerText,
                // type_quest: this.value,
                csrfmiddlewaretoken: csrftoken,
            },
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
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
    var originalQuestId = lastHeader.attr("quest_id");
    clonedHeader.attr("quest_id", parseInt(originalQuestId) + 1);
    // Ищем внутри клонированного элемента элемент "select" и устанавливаем первый вариант выбора
    clonedHeader.find("select").prop("selectedIndex", 0);
    // Вставляем клонированный элемент после оригинала
    clonedHeader.insertAfter(lastHeader).hide().fadeIn();

    // todo добавление в базу тут
    // addQuestionQuery($new_block_quest)
}


// в функцию принимаем блок с вопросом
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


// $(".quest_section").on('mouseover', function () {
//     console.log('qq')
// })


// // для таскалки
// $('.td-quest-col__cell').hover(
//     function () {
//         $('.page-child__drag-handle', this).fadeIn(0);
//     },
//
//     function () {
//         $('.page-child__drag-handle', this).fadeOut(0);
//     }
// )


// ФУНКЦИЯ ДЛЯ ПЕРЕХОДА ПО ВКЛАДКАМ

$(document).ready(function() {
  $('.tab').on('click', function(e) {
    var tabId = $(this).data('tab-id');
    // Отправляем AJAX-запрос на сервер Django, чтобы получить содержимое вкладки
    $.ajax({
      url: '/polls/',
      type: 'POST',
      data: {
        'tab_id': tabId
      },
      success: function(response) {
        // Обновляем содержимое вкладки
        $('#tab' + tabId).html(response);
        // Показываем скрытый div и скрываем текущий
        $('.tabs #tab' + tabId).slideDown(400).addClass('active').siblings().slideUp(400).removeClass('active');
      }
    });
    // Отменяем действие по умолчанию
    e.preventDefault();
  });
});
