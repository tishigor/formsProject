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

// td-form-col
$(function () {
    $(".td-sites-grid").sortable({
        connectWith: ".td-sites-grid",
        handle: ".quest_upper",
        // axis: "y",
        cursor: "n-resize",
        revert: 400, //плавная анимация возвращения сорт. элемента на свое место
        // cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder",
    });

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

$('.td-quest__name').keyup(delay(function (e) {
    // let url = '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + this.getAttribute('quest_id') + '/'
    // $.post(url, {name: this.innerText})
    //     .done(function (data) {
    //         alert("Data Loaded: " + data);
    //     });

    $.ajax({
        url: '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + this.getAttribute('quest_id') + '/',
        type: 'POST',
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


// ТЕСТ TYPEWATCH'A

// var options = {
//     callback: function (value) { console.log('TypeWatch callback: (' + (this.type || this.nodeName) + ') ' + value); },
//     wait: 750,
//     highlight: true,
//     allowSubmit: false,
//     captureLength: 2
// }
// $(".td-quest__name").typeWatch(options);


// $(document).ready(function () {
//     $('.td-quest__name').typeWatch({
//         captureLength: 2,
//         callback: function (value) {
//             console.log(value);
//             $.ajax({
//                 url: '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + this.getAttribute('quest_id') + '/',
//                 type: 'POST',
//                 data: {
//                     name: value,
//                     csrfmiddlewaretoken: csrftoken,
//                 },
//                 beforeSend: function () {
//                     console.log('beforeSend');
//                 },
//                 success: function (data) {
//                     console.log('success');
//                     // alert(data);
//                 },
//                 onerror: function (data) {
//                     console.log('onerror');
//                     alert(data);
//                 }
//             });
//         }
//     });
// });

//
// $.ajax({
//     url: '/psy/choice_test/' + $('#choice_test').attr('type_test') + '/' + sel.value,  //type_test это про то, для кого тетсирование (преподов или обучающихся)
//     beforeSend: function () {
//         progress.addClass('progress');
//         $('#available_variants').prepend(progress);
//     },
//     success: function (data) {
//         progress.remove();
//         $('#available_variants').append(data);
//     },
//     onerror: function (data) {
//         progress.remove();
//         alert(data);
//     }
// });


//добавление блока с вопросом

$('button').on('click', addQuestBlock);

function addQuestBlock() {
    // let block_quest = '<div style="display: none" class="td-quest-col__cell" id="question123">\n' +
    //     '                            <div class="block td-quest-col__header" data-item-kind="">\n' +
    //     '                                <div class="td-sites-grid__more" role="button"></div>\n' +
    //     '                                <div class="td-sites-more"></div>\n' +
    //     '                                <div class="quest_upper"></div>\n' +
    //     '                                <div class="quest_section">\n' +
    //     '                                    <div class="td-quest__name" contentEditable style="outline: none"\n' +
    //     '                                         role="textbox" aria-multiline="true"\n' +
    //     '                                         quest_id="{{ quest.id }}">Вопрос</div>\n' +
    //     '                                    <div class="td-site__descr" contenteditable="true"\n' +
    //     '                                         style="outline: none">Тип вопроса</div>\n' +
    //     '                                </div>\n' +
    //     '                            </div>\n' +
    //     '                        </div>'
    let block_quest = '<div class="block td-quest-col__header">\n' +
        '                                <div class="td-sites-grid__more" role="button"></div>\n' +
        '                                <div class="td-sites-more"></div>\n' +
        '                                <div class="quest_upper"></div>\n' +
        '\n' +
        '                                <div class="page-child__drag-handle ui-sortable-handle" style="opacity: 0;"><img style="top: 50px; position: relative;" src="data:image/svg+xml,%3Csvg width=\'12\' height=\'16\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill-rule=\'evenodd\' clip-rule=\'evenodd\' d=\'M3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5C2.82843 0.5 3.5 1.17157 3.5 2ZM2 9.5C2.82843 9.5 3.5 8.82843 3.5 8C3.5 7.17157 2.82843 6.5 2 6.5C1.17157 6.5 0.5 7.17157 0.5 8C0.5 8.82843 1.17157 9.5 2 9.5ZM2 15.5C2.82843 15.5 3.5 14.8284 3.5 14C3.5 13.1716 2.82843 12.5 2 12.5C1.17157 12.5 0.5 13.1716 0.5 14C0.5 14.8284 1.17157 15.5 2 15.5ZM10 15.5C10.8284 15.5 11.5 14.8284 11.5 14C11.5 13.1716 10.8284 12.5 10 12.5C9.17157 12.5 8.5 13.1716 8.5 14C8.5 14.8284 9.17157 15.5 10 15.5ZM11.5 8C11.5 8.82843 10.8284 9.5 10 9.5C9.17157 9.5 8.5 8.82843 8.5 8C8.5 7.17157 9.17157 6.5 10 6.5C10.8284 6.5 11.5 7.17157 11.5 8ZM10 3.5C10.8284 3.5 11.5 2.82843 11.5 2C11.5 1.17157 10.8284 0.5 10 0.5C9.17157 0.5 8.5 1.17157 8.5 2C8.5 2.82843 9.17157 3.5 10 3.5Z\' fill=\'%23475A80\' fill-opacity=\'.5\'/%3E%3C/svg%3E"></div>\n' +
        '                                <div class="quest_section">\n' +
        '                                    \n' +
        '                                    \n' +
        '                                    \n' +
        '                                        <div class="td-quest__name" contenteditable="" style="outline: none" role="textbox" aria-multiline="true" quest_id="3">Вопрос\n' +
        '                                        </div>\n' +
        '                                        \n' +
        '                                        <div class="td-site__descr" contenteditable="true" style="outline: none">Тип вопроса</div>\n' +
        '                                    \n' +
        '                                </div>\n' +
        '                            </div>'


    $('.td-sites-grid').append($(block_quest).fadeIn())

    addQuestionQuery(quest_block)
    // $('#question123').fadeIn()
    // $(block_quest).hide().append()
}


// в функцию принимаем блок с вопросом
function addQuestionQuery(quest_block) {

    url = '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + quest_block.getAttribute('quest_id') + '/'


    $.ajax({
        url: '/polls/' + $('.td-form-col__cell').attr('form_id') + '/' + this.getAttribute('quest_id') + '/',
        type: 'POST',
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




