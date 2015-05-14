Date.prototype.isLeapYear = function () {
    var y = this.getFullYear();
    return y % 4 == 0 && y % 100 != 0 || y % 400 == 0;
};

Date.prototype.getDaysInMonth = function () {
    return arguments.callee[this.isLeapYear() ? 'L' : 'R'][this.getMonth()];
};

Date.prototype.getDaysInMonth.R = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.prototype.getDaysInMonth.L = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function prevMonth(datepicker) {
    var month = getMonth(datepicker);
    if (--month < 0) {
        month = 11;
        var year = getYear(datepicker);
        --year;
        setYear(datepicker, year, true);
    }
    setMonth(datepicker, month);

    return false;
}

function nextMonth(datepicker) {
    var month = getMonth(datepicker);
    if (++month > 11) {
        month = 0;
        var year = getYear(datepicker);
        ++year;
        setYear(datepicker, year, true);
    }
    setMonth(datepicker, month);

    return false;
}

function numberToMonth(num) {
    return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'][num];
}

function getYear(datepicker) {
    return parseInt(datepicker.find('input[type=hidden][name=year]').val());
}

function getMonth(datepicker) {
    return parseInt(datepicker.find('input[type=hidden][name=month]').val());
}

function getDay(datepicker) {
    return parseInt(datepicker.find('input[type=hidden][name=day]').val());
}

function rebuildDatepicker(datepicker) {
    var header = datepicker.find('.datepicker-window-header');
    header.find('span').text(numberToMonth(getMonth(datepicker)) + ' ' + getYear(datepicker));

    var daysTable = datepicker.find('.datepicker-window-table');
    daysTable.empty();
    if (daysTable.length) {
        var date = new Date(getYear(datepicker), getMonth(datepicker), 1);
        var daysCount = date.getDaysInMonth();
        var dayOfWeek = date.getDay() - 1;
        if (dayOfWeek < 0) {
            dayOfWeek = 6;
        }
        var offset = dayOfWeek;
        var done = false;

        for (j = 0; !done; ++j) {
            var monthDaysTableRow = $(document.createElement('tr'));
            daysTable.append(monthDaysTableRow);

            for (i = 0; i < 7; ++i) {
                var d = i + j * 7 + 1 - dayOfWeek;
                var column = $(document.createElement('td'))
                    .text(d <= daysCount && offset-- <= 0 ? d : '');
                monthDaysTableRow.append(column);

                if (d >= daysCount) {
                    done = true;
                }
            }
        }
    }
}

function setYear(datepicker, year, dontRebuild) {
    datepicker.find('input[type=hidden][name=year]').val(year);

    if (!dontRebuild) {
        rebuildDatepicker(datepicker);
    }
}

function setMonth(datepicker, month, dontRebuild) {
    datepicker.find('input[type=hidden][name=month]').val(month);
    
    if (!dontRebuild) {
        rebuildDatepicker(datepicker);
    }
}

function setDay(datepicker, day, dontRebuild) {
    datepicker.find('input[type=hidden][name=day]').val(day);
    
    if (!dontRebuild) {
        rebuildDatepicker(datepicker);
    }
}

function setDate(datepicker, year, month, day) {
    setYear(datepicker, year, true);
    setMonth(datepicker, month, true);
    setDay(datepicker, day, true);
    rebuildDatepicker(datepicker);
}

function createDatepicker() {
    var window = $(document.createElement('div'))
        .addClass('datepicker-window');

    // hidden fields

    var hiddenDay = $(document.createElement('input'))
        .attr('type', 'hidden')
        .attr('name', 'day');
    window.append(hiddenDay);

    var hiddenMonth = $(document.createElement('input'))
        .attr('type', 'hidden')
        .attr('name', 'month');
    window.append(hiddenMonth);

    var hiddenYear = $(document.createElement('input'))
        .attr('type', 'hidden')
        .attr('name', 'year');
    window.append(hiddenYear);

    // header

    var header = $(document.createElement('div'))
        .addClass('datepicker-window-header');
    window.append(header);

    var prevMonthButton = $(document.createElement('a'))
        .attr('href', '/')
        .click(function (e) {
            e.stopPropagation();
            prevMonth($(this).parent().parent());
            return false;
        });
    header.append(prevMonthButton);

    var title = $(document.createElement('span'));
    header.append(title);

    var nextMothButton = $(document.createElement('a'))
        .attr('href', '/')
        .click(function (e) {
            e.stopPropagation();
            nextMonth($(this).parent().parent());
            return false;
        });
    header.append(nextMothButton);

    // set current date
    var today = new Date();
    setDate(window, today.getFullYear(), today.getMonth(), today.getDate());

    // week days table

    var daysTable = $(document.createElement('table'))
        .addClass('datepicker-window-days');
    window.append(daysTable);

    var daysTableRow = $(document.createElement('tr'));
    daysTable.append(daysTableRow);
    _.each(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], function (day) {
        var daysTableColumn = $(document.createElement('td'))
            .text(day);
        daysTableRow.append(daysTableColumn);
    });

    // month days table

    var monthDaysTable = $(document.createElement('table'))
        .addClass('datepicker-window-table');
    window.append(monthDaysTable);

    rebuildDatepicker(window);
    return window;
}