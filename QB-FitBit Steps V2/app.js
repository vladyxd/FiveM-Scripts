let openedApp = '.main-screen';
const escKey = 27;
const fadeTime = 150;
let steps = 0;
let checkIntervals = [];
qbFitbit = {}

$(document).ready(function () {
    window.addEventListener('message', function (event) {
        if (event.data.action === 'openWatch') {
            qbFitbit.Open();
            steps = Math.floor(event.data.steps);
        }
    });
});

$(document).on('keydown', function (e) {
    if (e.keyCode === escKey) {
        qbFitbit.Close();
    }
});

qbFitbit.Open = function () {
    $('.container').fadeIn(fadeTime);
    checkIntervals.push(setInterval(requestSteps, 500));

}

qbFitbit.Close = function () {
    $('.container').fadeOut(fadeTime);
    $.post('https://qb-fitbit/close')
    checkIntervals.forEach(clearInterval);

}
function requestSteps() {
    steps = $.post('https://qb-fitbit/requestSteps', JSON.stringify({}), function (d) {
        let data = Math.floor(d);
        console.log(data)
        $('#stepsdata').text(data);
        return data;
    });
}
$(document).on('click', '.fitbit-app', function (e) {
    e.preventDefault();

    const pressedApp = $(this).data('app');

    $(openedApp).css({ display: 'none' });
    $(`.${pressedApp}-app`).css({ display: 'block' });
    openedApp = pressedApp;
    if (pressedApp === 'steps') {

        checkIntervals.push(setInterval(requestSteps, 500));
    }
    else {
        checkIntervals.forEach(clearInterval);

    }
});

$(document).on('click', '.back-food-settings', function (e) {
    e.preventDefault();

    $('.food-app').css({ display: 'none' });
    $('.main-screen').css({ display: 'block' });

    openedApp = '.main-screen';
});

$(document).on('click', '.back-thirst-settings', function (e) {
    e.preventDefault();

    $('.thirst-app').css({ display: 'none' });
    $('.main-screen').css({ display: 'block' });

    openedApp = '.main-screen';
});
$(document).on('click', '.back-steps-settings', function (e) {
    e.preventDefault();

    $('.steps-app').css({ display: 'none' });
    $('.main-screen').css({ display: 'block' });

    openedApp = '.main-screen';
});
$(document).on('click', '.reset-steps-settings', function (e) {
    e.preventDefault();

    $('.steps-app').css({ display: 'none' });
    $('.main-screen').css({ display: 'block' });
    $.post('https://qb-smallresources/resetSteps', JSON.stringify({}));

    openedApp = '.main-screen';
});
$(document).on('click', '.save-food-settings', function (e) {
    e.preventDefault();

    const foodValue = $(this).parent().parent().find('input');

    if (parseInt(foodValue.val()) <= 100) {
        $.post('https://qb-fitbit/setFoodWarning', JSON.stringify({
            value: foodValue.val()
        }));
    }
});

$(document).on('click', '.save-thirst-settings', function (e) {
    e.preventDefault();

    const thirstValue = $(this).parent().parent().find('input');

    if (parseInt(thirstValue.val()) <= 100) {
        $.post('https://qb-fitbit/setThirstWarning', JSON.stringify({
            value: thirstValue.val()
        }));
    }
});
