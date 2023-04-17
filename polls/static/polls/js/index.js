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


// todo под доработку
// я же могу в new_order добавить новый добавляемый блок, а потом его создать в success по факту
// после получения последовательности вопросов сам , получаю id элемента на котором нажал '+', добавляю в последовательность новую запись и передаю это в бэк

// добавление вопроса
$(document).ready(function () {
    $('.td-sites-grid').on('click','.plus_quest', function () {

        // находим блок вопроса где нажали на plus
        let thisBlock = $(this).closest('.block')
        let thisBlockId = thisBlock.attr("id");
        let new_order = $(this).closest('#projectssortable').sortable("toArray"); // получаем новую последовательность вопросов

        // var arr = ["question_13", "question_15"];
        var index = new_order.indexOf("question_13");

        if (index !== -1) {
            new_order.splice(index + 1, 0, "new_id");
        }





        // // Клонируем этот элемент
        // let newBlock = thisBlock.clone();
        // // Ищем внутри клонированного элемента элемент с классом "td-quest__name" и меняем его текст на "Новый вопрос"
        // newBlock.find(".td-quest__name").text("Новый вопрос");
        // newBlock.attr("id", 'new_id');
        // // Ищем внутри клонированного элемента элемент "select" и устанавливаем первый вариант выбора
        // newBlock.find("select").prop("selectedIndex", 0);
        // // Вставляем клонированный элемент после оригинала
        // newBlock.insertAfter(thisBlock).hide().fadeIn();

        // если другой атрибут кроме айдишника
        // $(this).closest('#projectssortable').sortable("toArray", {attribute: 'quest_id'})
        // let new_order = $(this).closest('#projectssortable').sortable("toArray"); // получаем новую последовательность вопросов

        $.ajax({
            type: 'POST',
            url: '/polls/add_question/',
            data: {
                quest_name: "Новый вопрос",
                // todo сюда передаем часть теста к которой добавляется вопрос (пока что закидываю 1)
                // todo вопросы будут находится в div, у которого будет атрибут = id части теста
                part_test_id: 2,
                new_order: new_order,
                // number: number,
                // csrfmiddlewaretoken: csrftoken,
            },
            beforeSend: function () {
                // todo имитация загрузки
                console.log('beforeSend');
            },
            success: function (response) {

                // Клонируем этот элемент
                let newBlock = thisBlock.clone();
                // Ищем внутри клонированного элемента элемент с классом "td-quest__name" и меняем его текст на "Новый вопрос"
                newBlock.find(".td-quest__name").text("Новый вопрос");
                newBlock.attr("id", 'question_'+response['new_quest_id']);
                newBlock.attr("quest_id", response['new_quest_id']);
                newBlock.attr("number", response['new_number']);
                // Ищем внутри клонированного элемента элемент "select" и устанавливаем первый вариант выбора
                newBlock.find("select").prop("selectedIndex", 0);
                // Вставляем клонированный элемент после оригинала
                newBlock.insertAfter(thisBlock).hide().fadeIn();


                // после успешного добавления нужно менять id у добавленного блока на нормальный
                // после того как добавится этот блок всем блокам, которые будут идти после него нужно будет обновить атрибут number
                // newBlock.attr("id", 'question_'+response['new_quest_id']);
                // newBlock.attr("quest_id", response['new_quest_id']);
                // newBlock.attr("number", response['new_number']);

                // обновление атрибута number у всех нижестоящих блоков после доабвленного
                newBlock.nextAll('.block.td-quest-col__header').each(function () {
                    let current_question_number = parseInt($(this).attr('number'));
                    $(this).attr('number', current_question_number + 1);
                    console.log('q\n')
                });
            },
            onerror: function (data) {
                console.log('onerror');
                alert(data);
            }
        });
    });
});


// удаление вопроса
// $(document).ready(function () {
//     $(".cross_quest").click(function (){
//         $.ajax({
//
//         });
//     })
// })


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
                // todo использовать td-sites-grid вместо projectssortable???
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