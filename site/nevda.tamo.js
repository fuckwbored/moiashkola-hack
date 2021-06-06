(function ($) {
    $.validator.unobtrusive.parseDynamicContent = function (selector) {
        //use the normal unobstrusive.parse method
        $.validator.unobtrusive.parse(selector);

        //get the relevant form
        var form = $(selector).first().closest('form');

        //get the collections of unobstrusive validators, and jquery validators
        //and compare the two
        var unobtrusiveValidation = form.data('unobtrusiveValidation');
        var validator = form.validate();

        if (unobtrusiveValidation && unobtrusiveValidation.options && unobtrusiveValidation.options.rules) {
            $.each(unobtrusiveValidation.options.rules, function (elname, elrules) {
                if (validator.settings.rules[elname] == undefined) {
                    var args = {};

                    $.extend(args, elrules);
                    args.messages = unobtrusiveValidation.options.messages[elname];
                    //edit:use quoted strings for the name selector
                    $("[name='" + elname + "']").rules('add', args);
                } else {
                    $.each(elrules, function (rulename, data) {
                        if (validator.settings.rules[elname][rulename] == undefined) {
                            var args = {};

                            args[rulename] = data;
                            args.messages = unobtrusiveValidation.options.messages[elname][rulename];
                            //edit:use quoted strings for the name selector
                            $("[name='" + elname + "']").rules('add', args);
                        }
                    });
                }
            });
        }
    }
})($);

function initialize_report() {
    var imageStatusTemplate = $('input[id=ImageStatusTemplate]').val();
    var reportDiv = $('#ReportImageDiv');
    var reportMessageDiv = $('#ReportImageDivMessageDiv');
    var reportImage = $('#ReportImage');
    //var reportPagerFirstImage = $('#FirstImage');
    var reportPagerPreviousImage = $('#PreviousImage');
    var reportPagerNextImage = $('#NextImage');
    //var reportPagerLastImage = $('#LastImage');
    var reportPagerImageStatus = $('#ImageStatus');
    var totalPages = 0;
    var currentPage = 0;
    var reportPageHeight = parseInt($('#ReportPageHeight').val());

    refreshImageStatus();
    setFooter();

    reportImage.on('load', function () {
        if (reportDiv.length > 0) {
            /*reportPagerFirstImage.click(function (event) {
            event.preventDefault();
            currentPage = 1;
            selectPage();
            });*/

            reportPagerPreviousImage.click(function (event) {
                event.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    selectPage('p');
                }
            });

            reportPagerNextImage.click(function (event) {
                event.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    selectPage('n');
                }
            });

            /*reportPagerLastImage.click(function (event) {
            event.preventDefault();
            currentPage = totalPages;
            selectPage();
            });*/

            reportMessageDiv.hide();
            reportImage.show();
            currentPage = 1;
            totalPages = Math.ceil(reportImage.height() / reportPageHeight);
            refreshImageStatus();
            setFooter();
        }
    });

    function selectPage(type) {
        refreshImageStatus();

        if (type == 'p') {
            reportImage.addClass('page-' + currentPage);
            reportImage.removeClass('page-' + (currentPage + 1));
        } else {
            reportImage.addClass('page-' + currentPage);
            reportImage.removeClass('page-' + (currentPage - 1));
        }
    }

    function refreshImageStatus() {
        if (imageStatusTemplate != undefined) {
            reportPagerImageStatus.html(function () {
                return imageStatusTemplate.replace('{currentPage}', currentPage).replace('{totalPages}', totalPages);
            });
        }
    }
}

$(document).ready(function () {
    $(document).on('mouseover', '.daugiau_autoriu_link_knygu_sarase', function () {
        var biid = $(this).find('#bibliotekosIrasoIdAutoriuPaieskai').val();

        var info = {
            id: biid
        };

        var baseUrl = $('#baseAddress');
        var daugiau = $(this);
        var container = daugiau.closest('td').find('.daugiauAutoriuContainer');
        var container_count = $(container).find("span").length;

        if (container_count >= 0) {
            $.post(baseUrl.val() + "BibliotekosKatalogas/GetDaugiauAutoriu", info, function (data) {
                container.empty();
                container.append(data);
                container.removeClass('daugiauAutoriuContainer').addClass('daugiauAutoriuContainerFull');
            });
        }      
    });

    $("#search_input").focus(function () {
        if ($(this).val() == $(this)[0].defaultValue)
            $(this).val('');
    });

    $(document).on("blur", "#c_search_bar #search_input", function () {
        val = $(this).val();

        if (val === "") {
            $(this).val($(this)[0].defaultValue);
        }
    });

    $("#library_search_input").focus(function () {
        if ($(this).val() == $(this)[0].defaultValue)
            $(this).val('');
    });

    $(document).on("blur", "#c_search_bar #library_search_input", function () {
        val = $(this).val();

        if (val === "") {
            $(this).val($(this)[0].defaultValue);
        }
    });

    $(document).on('click', '#change_role.inactive', function (e) {
        e.preventDefault();
        $('#role_options').removeClass('hidden');
        $('#h_user2').addClass('hover');
        $(this).removeClass('inactive').addClass('active');
        $('#role_options').prop('mouseIsOver', false);
    });

    $(document).on('click', '#change_role.active', function (e) {
        e.preventDefault();
        $('#role_options').addClass('hidden');
        $('#h_user2').removeClass('hover');
        $(this).removeClass('active').addClass('inactive');
    });

    $(document).on('mouseenter', '#role_options', function () {
        $(this).prop('mouseIsOver', true);
    });

    $(document).on('mouseleave', '#role_options', function () {
        $(this).prop('mouseIsOver', false);
    });

    $(document).on('blur', '#change_role.active', function (e) {
        e.preventDefault();

        if ($('#role_options').prop('mouseIsOver') == false) {
            $('#role_options').addClass('hidden');
            $('#h_user2').removeClass('hover');
            $(this).removeClass('active').addClass('inactive');
        }
    });

    $(document).on('click', '.select_box .selected', function (e) {
        e.preventDefault();

        var selections = $(this).siblings('.selections');

        if (selections.hasClass('hidden')) {
            selections.removeClass('hidden').addClass('shown');
            $('.selections').prop('mouseIsOver', false);
        } else if (selections.hasClass('shown')) {
            selections.removeClass('shown').addClass('hidden');
        }
    });

    $(document).on('mouseenter', '.selections', function () {
        $(this).prop('mouseIsOver', true);
    });

    $(document).on('mouseleave', '.selections', function () {
        $(this).prop('mouseIsOver', false);
    });

    $(document).on('focusout', '.select_box .selected', function (e) {
        if ($('.selections').prop('mouseIsOver') == false) {
            $(this).siblings('.selections').removeClass('shown').addClass('hidden');
        }
    });

    $(document).on('click', '.submit_button', function (e) {
        e.preventDefault();
        $(this).parents('form').submit();
    });

    $("a.change_klase").click(function (e) {
        e.preventDefault();
        var listas = $("div#klasiu_sarasas_container");

        if ($(listas).is(":visible")) {
            listas.hide();
        } else {
            listas.show();
        }
    });

    $("#klasiu_sarasas a").click(function (e) {
        e.preventDefault();

        createLoadingDialog();

        var selected = $(this);
        var nuoroda = selected.attr("href");
        var meniu = selected.parents(".s_menu_title").next();

        $.post(nuoroda, function (data) {
            meniu.html(data);
            $("a.change_klase").html(selected.find("span").html());
            $("div#klasiu_sarasas_container").hide();
            window.location.href = "/";
            deleLoadingDialog();
        });
    });

    $('.symbol_count_div').each(function () {
        var targetName = $(this).attr('data-target');
        var target = $('textarea[name="' + targetName + '"]');

        if (target && target.length == 0)
            target = $('div.kendo_html_editor_div[name="' + targetName + '"]');

        if (target != null) {
            symbolsCount(target, $(this), $(this).attr('data-max-count'));
        }
    });

    hideSuccessMessage();
    attachElements();
    setFooter();
    fixMdLabels();
});

function onKendoInlineHtmlEditorExecute(e) {
    if (e) {
        if (e.name == "createlink") {
            setTimeout(function () {
                $("#k-editor-link-target").attr("checked", true);
            });
        }
    }
}

function onKendoInlineHtmlEditorChange(e) {
    if (e) {
        var name = this.element.attr("name");

        if (!name)
            return;

        var hidden = $("input.kendo_html_editor_hidden_input[type=hidden][name='" + name + "']");

        if (hidden && hidden.length) {
            hidden.val(this.value());
        }
    }
}

function symbolsCount(textbox, restSymbolsCount, maxLength) {
    textbox.keyup(function () {
        var isKendoEditor = $(this).hasClass("kendo_html_editor_div");
        var value = isKendoEditor ? $(this).html() : $(this).val();

        if (value.length >= maxLength) {
            if (isKendoEditor)
                $(this).html(value.substring(0, maxLength));
            else
                $(this).val(value.substring(0, maxLength));
        }

        restSymbolsCount.text(maxLength - value.length);
    });

    textbox.keyup();
}

function setFooter() {
    if ($('#c_main').length != 0) {
        $('#c_main').css('height', 'auto');

        if ($('#sidebar_spacer').length !== 0) {
            $('#sidebar_spacer').css('height', 'auto');
        }

        var c_main_height = $('#footer').offset().top - $('#c_main').offset().top - parseInt($('#footer').css('margin-top'));

        $('#c_main').height(c_main_height);

        if ($('#sidebar_spacer').length !== 0) {
            var sidebar_spacer_height = $('#footer').offset().top - $('#sidebar_spacer').offset().top;
            $('#sidebar_spacer').height(sidebar_spacer_height);
        }
    }
}

function tamo_get(url, data, funkcija) {
    $.ajax(url, {
        cache: false,
        data: data,
        type: 'GET',
        success: funkcija,
        error: function () {
            if ($('#mdb-preloader').length != 0) {
                deleLoadingDialog();
            }

            alert(window.translations['_apdorojantUzklausaIvykoKlaida']);
        }
    });
}

function tamo_post(url, data, funkcija) {
    $.ajax(url, {
        cache: false,
        data: data,
        type: 'POST',
        success: funkcija,
        error: function () {
            if ($('#mdb-preloader').length != 0) {
                deleLoadingDialog();
            }

            alert(window.translations['_apdorojantUzklausaIvykoKlaida']);
        }
    });
}

function hideSuccessMessage() {
    var success_message = $('.success_message').parents('.message_to_hide');

    setTimeout(function () {
        success_message.slideUp('normal', function () {
            setFooter();
        });
    }, 3000);
}

function append(selector, item) {
    selector.append(item);
    setFooter();
}

function show(selector) {
    selector.show();
    setFooter();
}

function hide(selector) {
    selector.hide();
    setFooter();
}

function toggle(selector) {
    selector.toggle();
    setFooter();
}

function remove(selector) {
    selector.remove();
    setFooter();
}

function after(target, data) {
    target.after(data);
    setFooter();
}

function replace(target, data) {
    target.after(data);
    target.remove();
    setFooter();
}

function getTabIndex() {
    if (navigator.appName != 'Microsoft Internet Explorer') {
        var hash = window.location.hash.replace('#tabas-', '');
        var index;

        index = parseInt(hash);

        if (isNaN(index))
            index = 1;

        return index - 1;
    }

    return 0;
}

function setTabIndex(index) {
    document.location.replace('#tabas-' + (index + 1));
}

function fixedColumnTable(selector) {
    if (!detectIE()) {
        var lentele = selector;

        lentele.addClass('left');

        //        $.each(lentele.find('tr'), function () {
        //            $(this).css('height', $(this).height());
        //        });

        var kopija = lentele.clone();
        kopija.addClass('left');

        lentele.find('td:not(.fixed), th:not(.fixed), col:not(.fixed)').remove();
        kopija.find('td.fixed, th.fixed, col.fixed').remove();

        var lentelesCols = lentele.find('col');
        var visasPlotis = 0;

        $.each(lentelesCols, function () {
            visasPlotis += parseInt($(this).attr('width'));
        });

        lentele.css('width', visasPlotis);
        //append(selector, '<div class="left c_block padLess borderless" id="fiksuota_dalis"></div>');
        selector.parent().append('<div class="left slider_holder" id="slenkanti_dalis"></div>');
        //append(selector.parent(), '<div class="left slider_holder" id="slenkanti_dalis"></div>');

        $('#slenkanti_dalis').css('width', selector.parent().width() - lentele.outerWidth() - 1);
        append($('#slenkanti_dalis'), kopija);

        var kairesEilutes = lentele.find('tr');
        var desinesEilutes = kopija.find('tr');

        for (var i = 0; i < kairesEilutes.length; i++) {
            var kaireEilute = $(kairesEilutes.get(i));;
            var desineEilute = $(desinesEilutes.get(i));
            var aukstis = kaireEilute.height();

            if (desineEilute.height() > aukstis)
                aukstis = desineEilute.height();

            kaireEilute.css('height', aukstis);
            desineEilute.css('height', aukstis);
        }

        var visasAukstis = selector.parent().height();

        if (window.opera && window.opera.buildNumber) // kad Operoj neatsirastu vertikalus scroll bar'as
            visasAukstis += 20;

        $('#slenkanti_dalis').css('height', visasAukstis);

        setFooter();
    }
}

function blink(selector, pradineSpalva, mirktelejimoSpalva, laikas) {
    var mirksi = selector.find('#mirksi').val();

    if (mirksi == 'False') {
        selector.find('#mirksi').val('True');
        selector.css('backgroundColor', mirktelejimoSpalva);

        if (laikas == null)
            laikas = 1000;

        selector.animate({ 'backgroundColor': pradineSpalva }, laikas, function () {
            selector.css('backgroundColor', "");
            selector.find('#mirksi').val('False');
        });
    }
}

function attachElements(selector) {
    if (selector == undefined)
        selector = 'body';

    var element = $(selector);

    if (element != undefined) {
        var datepickers = element.find('input[class~=datepicker]');
        var timepickers = element.find('input[class~=timepicker]');

        if (datepickers.length != 0) {
            datepickers.datepicker({
                constrainInput: true,
                //dateFormat: 'yy-mm-dd',
                onSelect: function (dateText, inst) {
                    $(this).valid();

                    fixMdLabel(this);
                }
            });

            datepickers.each(function (index, Element) {
                $(Element).next('img[class~=datepickerButton]').click(Element, function (e) {
                    $(e.data).datepicker('show');
                });
            });
        }

        if (timepickers.length != 0) {
            timepickers.timepicker({
                showLeadingZero: false,
                showPeriodLabels: false,
                hourText: $.timepickerLocalization.hourText,
                minuteText: $.timepickerLocalization.minuteText,
                onSelect: function (time, inst) {
                    $(this).valid();
                },
                rows: 4
            });
        }

        timepickers.each(function (index, Element) {
            $(Element).next('img[class~=timepickerButton]').click(Element, function (e) {
                $(e.data).timepicker('show', this);
            });
        });

        $('input[class~=deleteItemButton]').click(function (e) {
            $(this).parent().remove();
            setFooter();
        });

        $(document).on('click', 'a.delete_row_button', function (e) {
            e.preventDefault();
            $(this).parents('tr').remove();
            setFooter();
        });

        fixMdLabels();
    }
}

function ajaxGetSuApdorojimu(url, parametrai, klaidosZinute, sekmesFunkcija, klaidosFunkcija) {
    $.ajax(url, {
        cache: false,
        data: parametrai,
        success: function (data) {
            apdorotiAjaxAtsakyma(data, sekmesFunkcija, klaidosZinute, klaidosFunkcija);
        },
        error: function () {
            var klaidosDuomenys = { SekmingaUzklausa: false, Zinute: klaidosZinute };
            apdorotiAjaxAtsakyma(klaidosDuomenys, null, klaidosZinute);
        }
    });
}

function apdorotiAjaxAtsakyma(atsakymas, sekmesFunkcija, klaidosZinute, klaidosFunkcija) {
    var klaiduDiv = $('.errorHolder');

    klaiduDiv.empty();

    var successDiv = $('.successHolder');

    successDiv.empty();

    if (atsakymas.SekmingaUzklausa == true) {
        if (sekmesFunkcija != null)
            sekmesFunkcija(atsakymas);

        if (atsakymas.Zinute != null) {
            toastr.options = {
                "closeButton": true,
                "positionClass": "toast-bottom-left",
            };

            toastr.success(atsakymas.Zinute);
        }
    } else {
        if (atsakymas.Zinute || klaidosZinute != null) {
            klaiduDiv.append('<div class="alert alert-danger"></div>');

            if ('undefined' === (typeof klaidosFunkcija)) {
                var validacijosDiv = klaiduDiv.find('div:first');

                if (atsakymas.Zinute != null) {
                    validacijosDiv.append('<ul><li>' + atsakymas.Zinute + '</li></ul>');
                } else {
                    validacijosDiv.append('<ul><li>' + klaidosZinute + '</li></ul>');
                }
            } else {
                klaidosFunkcija(atsakymas);
            }
        }
    }
}

$('.disabledMenuLink').click(function (e) {
    e.preventDefault();
});

function createLoadingDialog() {
    var obj = $('.custom-loading-dialog');

    obj.append(`
        <div id="mdb-preloader" class="flex-center">
          <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div>
              <div class="gap-patch">
                <div class="circle"></div>
              </div>
              <div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div>
        </div>
    `);
}

function deleLoadingDialog() {
    remove($('#mdb-preloader'));
}

function showSuccessMessage(text) {
    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-bottom-left",
    };
    toastr.success(text);
}

function showErrorMessage(text) {
    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-bottom-left",
    };
    toastr.error(text);
}

function showOverlay() {
    var overlay = $('.overlay');

    if (overlay && overlay.length === 0) {
        overlay = $(
            '<div class="overlay flex-center">' +
            '   <div class="preloader-wrapper active">' +
            '       <div class="spinner-layer spinner-blue-only">' +
            '           <div class="circle-clipper left">' +
            '               <div class="circle"></div>' +
            '           </div>' +
            '           <div class="gap-patch">' +
            '               <div class="circle"></div>' +
            '           </div>' +
            '           <div class="circle-clipper right">' +
            '               <div class="circle"></div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        overlay.appendTo($('body'));
    }
}

function hideOverlay() {
    var overlay = $('.overlay');

    overlay.remove();
}

//custom client validation
(function ($) {
    // The validator function
    $.validator.addMethod('rangeDate', function (value, element, param) {
        try {
            var dateValue = $.datepicker.parseDate("yy-MM-dd", value);
        }
        catch (e) {
            return true;
        }

        return param.min <= dateValue && dateValue <= param.max;
    });

    // The adapter to support ASP.NET MVC unobtrusive validation
    $.validator.unobtrusive.adapters.add('rangedate', ['min', 'max'], function (options) {
        var params = {
            min: $.datepicker.parseDate("yy-MM-dd", options.params.min),
            max: $.datepicker.parseDate("yy-MM-dd", options.params.max)
            //min: $.datepicker.parseDate("yy-mm-dd", options.params.min),
            //max: $.datepicker.parseDate("yy-mm-dd", options.params.max)
        };

        options.rules['rangeDate'] = params;

        if (options.message) {
            options.messages['rangeDate'] = options.message;
        }
    });

    $.validator.addMethod('notgreaterdate', function (value, element, param) {
        try {
            var dateFrom = $.datepicker.parseDate("yy-MM-dd", value);
            var dateTo = $.datepicker.parseDate("yy-MM-dd", $('#' + param).val());

            if (dateTo == null)
                return true;
        }
        catch (e) {
            return true;
        }

        if (dateFrom > dateTo)
            return false;

        return true;
    });

    $.validator.unobtrusive.adapters.addSingleVal('notgreaterdate', 'otherproperty');

    $.validator.addMethod('badformatdate', function (value, element, param) {
        try {
            var dateValue = $.datepicker.parseDate("yy-MM-dd", value);
        }
        catch (e) {
            return false;
        }

        return true;
    });

    $.validator.unobtrusive.adapters.addBool('badformatdate');
})($);

function fixMdLabels() {
    $('input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea').each(function (i, element) {
        fixMdLabel(element);
    });
}

function fixMdLabel(element) {
    if ((element.value != undefined && element.value.length > 0) || $(element).attr('placeholder') != null) {
        $(element).siblings('label').addClass('active');
    } else {
        $(element).siblings('label').removeClass('active');
    }
}

function updateMdbSelect(ddl) {
    ddl.material_select('refresh');
}

function downloadURI(uri, name) {
    //https://stackoverflow.com/a/23013574/2425617
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}
/*
serializes an object as form values.
supports primitives and arrays containing primitives
arrays are serialized with item index included
*/
function serializeForm(data) {
    var dataSerialized = "";
    for (var key in data) {
        var value = data[key];
        if (isPrimitiveType(value)) {
            dataSerialized += key + "=" + value + "&";
        }
        else if ($.isArray(value)) {
            for (var i = 0; i < value.length; ++i) {
                if (isPrimitiveType(value[i])) {
                    dataSerialized += key + "[" + i + "]=" + value[i] + "&";
                }
            }
        }
    }
    return dataSerialized.slice(0,-1);
}

function isPrimitiveType(value) {
    var typeName = typeof value;
    return typeName == "string"
        || typeName == "number"
        || typeName == "boolean"
        || typeName == "undefined";
}

/* = = = = = = = = = = BEGIN -> TABLE of DIVs (and ACCORDION on mobile screen) = = = = = = = = = = */

var maxMobileSize = 768; // this value should match the media query
var mobileAccordionTableSelector = ".div-table.table.mobile-accordion";
var previousOrientation = window.orientation;

var checkOrientation = function () {
    if (window.orientation !== previousOrientation) {
        previousOrientation = window.orientation;
        checkScreenSize();
    }
};

var checkScreenSize = function () {
    var width = $(window).width();

    if (width < maxMobileSize) {
        handleMobile();
    } else {
        handleDesktop();
    }
}

function handleMobile() {
    slideUpAllInactive();
}

function handleDesktop() {
    if ($('#mokinioId1').val() <= 0) {
        showRows();
    };
    addRowHighlighting();
}

function showRows() {
        $(mobileAccordionTableSelector + " .tr").each(function () {
            $(this).removeAttr("style");
        });
}

function addRowHighlighting() {
    var rows = $(".div-table .table .tbody .tr");

    /* Add a highlighting class on even rows */
    for (var i = 0; i < rows.length; i++) {
        if (i % 2 == 1) {
            $(rows[i]).addClass("alternate-highlight");
        }
    }
}

function slideUpAllInactive() {
    $(".div-table.table .rh").not(".active").each(function () {
        $(this).next().slideUp();
    });
}

function handleMobileAccordionTableClick(rowHeader) {
    var table = $(rowHeader).parents(".div-table.table");

    $(table).find(".rh").each(function () {
        $(this).removeClass("active");
    });

    slideUpAllInactive();

    var nextRow = $(rowHeader).next();

    if (!nextRow.is(":visible")) {
        $(rowHeader).addClass("active");
        nextRow.slideDown();
    }
}

function initDivTablesAndAccordions(skipSomeSteps) {
    var divTablesWithAccordions = $(document).find(mobileAccordionTableSelector);

    if (divTablesWithAccordions && divTablesWithAccordions.length > 0) {
        if (!skipSomeSteps) {
            window.addEventListener("resize", checkScreenSize, false);
            window.addEventListener("orientationchange", checkOrientation, false);
        }

        // Android doesn't always fire orientationChange on 180 degree turns
        setInterval(checkOrientation, 2000);

        checkScreenSize();

        $(mobileAccordionTableSelector + " .rh").unbind('click');

        $(mobileAccordionTableSelector + " .rh").click(function (event) {
            if (!$(event.target).closest('.clk-except').length) {
                handleMobileAccordionTableClick(this);
            }
        });
    }
}

function perc2color(perc, columnName, systemAnalyticsParameters) {

    var parameters = systemAnalyticsParameters.filter(function (item) { return item.ColumnCode == columnName })[0];

    if (!parameters) {
        return "";
    }

    var base = (parameters.MaxValue - parameters.MinValue);

    if (parameters.Inverted) {
        perc = 100 - perc;
    }

    if (base == 0) { perc = 100; }
    else {
        perc = (perc - parameters.MinValue) / base * 100;
    }

    var zeroVal = ((parameters.ZeroValue - parameters.MinValue) * 100) / base;

    var r, g, b = 0;

    var daugiklis1 = 255 / zeroVal;
    var daugiklis2 = 255 / (100 - zeroVal);

    if (perc < zeroVal) {
        r = 255;
        g = Math.round(daugiklis1 * perc);
    }
    else {
        g = 255;
        r = Math.round((daugiklis2 * 100) - daugiklis2 * perc);
    }
   
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}


$(document).ready(function () {
    hideContextMenu();

    function hideContextMenu() {
        $(".nevda-file-context-menu").hide();
    }

    $('.fileContextMenu').on("click", function (e) {
        var nevdaContextMenu = $(".nevda-file-context-menu");

        if (nevdaContextMenu.is(":visible"))
            hideContextMenu();
        else {
            nevdaContextMenu.show();
            nevdaContextMenu.css({ top: e.pageY + "px", left: e.pageX + "px" });

            nevdaContextMenu.attr({
                'file-download-action': $(this).closest("tr").find("#fileDownloadAction").val(),
                'file-delete-action': $(this).closest("tr").find("#fileDeleteAction").val()
            });
            if ($("#fileDeleteAction").val() == "")
                $('.nevda-file-context-menu #delete_link').remove();
        }
    })

    $('.conextMenuItem').on("click", function (e) {
        var action = e.target.getAttribute("data-action")

        if (action == "download") {
            window.location.href = $(this).parents('.nevda-file-context-menu').attr('file-download-action');
        } else if (action == "delete") {
            if (confirm($(this).attr('data-ar-tikrai-norite-istrinti'))) {
                $.post($(this).parents('.nevda-file-context-menu').attr('file-delete-action'), function (data) {
                    if (data.SekmingaUzklausa) {
                        location.reload();
                    } else {
                        var klaidosDuomenys = { SekmingaUzklausa: false, Zinute: data.Zinute };
                        apdorotiAjaxAtsakyma(klaidosDuomenys, null, null);
                    };
                });
            };       
        }
    })

    $(document).on("click", function (e) {
        if (!e.target.classList.contains("fileContextMenu"))
            hideContextMenu();
    });
});

/* = = = = = = = = = = END -> TABLE of DIVs (and ACCORDION on mobile screen) = = = = = = = = = = */