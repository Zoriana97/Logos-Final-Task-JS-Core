// Необхідно реалізувати наступний функціонал як на відео Puzzle, а саме:



// — Необхідно розбити картинку на 16 рівних частин і помістити їх в блоки. Розбивати картинку
//  на кусочки можна за допомогою background-position

// — При кліку на кнопку Start game або при перетягуванні пазла на правий блок(використовуємо drag & drop)
// має запуститися зворотній відлік. 
// Сама кнопка має заблокуватися.

// — Якщо час закінчився і ви не встигли скласти пазл має видати повідомлення 
// в модальному вікні: “It's a pity, but you lost”. Кнопка Check result має заблокуватися

// — При кліку на кнопку Check result має видати повідомлення 
// в модальному вікні: “You still have time, you sure?” з часом який залишився.

// — При кліку на кнопку Check перевіряється чи добре складений пазл, 
// якщо так видає повідомлення: “Woohoo, well done, you did it!” в іншому варіанті 
// “It's a pity, but you lost”. Кнопка Check result має заблокуватися.

// — При кліку на кнопку Close закриває модальне вікно.

// — При кліку на кнопку New game скидує час і заново рандомно розставляє пазли. 
// Кнопка Start game має розблокуватися, а кнопка Check result має бути заблокована.


$(document).ready(function() {
    let countingInterval;
    let countingStart;
    let timer;

    let countingMinutes = '01';
    let countingSeconds = '00';

    let currentPuzzleNumber;

    function countDown() {

        $('.btn-style-check').removeAttr('disabled'); 
        $('.btn-style-start').attr('disabled', 'disabled');

        timer = $('.timer-block').html();
        countingStart = new Date();
        countingInterval = setInterval(() => {
            let substractTime = new Date();
            let countDif = substractTime.getTime() - countingStart.getTime();

            countingMinutes = 0;
            countingSeconds = 60 - Math.floor(countDif / 1000); 

            if(countingSeconds === 60) {
                countingSeconds = 0;
                countingMinutes = 1;
            }

            if (countingMinutes === 0 && countingSeconds === 0) {
                checkResult();
            }

            if(countingMinutes < 10) countingMinutes = '0' + countingMinutes;
            if(countingSeconds < 10) countingSeconds = '0' + countingSeconds;

            $('.timer-block').html(`${countingMinutes}:${countingSeconds}`);
            $('.modal-window-inner-text').html(`You still have time, you sure? ${countingMinutes}:${countingSeconds}`);
        }, 1000);
    }

    $('.btn-style-start').on('click', countDown);


    function openModal() {
        $('.modal-window').removeClass('hide');

        $('.modal-window').css('zIndex', 5);

        $('.modal-window-inner-text').html(`You still have time, you sure? ${countingMinutes}:${countingSeconds}`);

        $('.modal-background').css({
            zIndex: 4,
            opacity: 1
        });

    }

    $('.btn-style-check').on('click', openModal);



    $('.modal-btn-close').on('click', function() {

        $('.modal-window').addClass('hide');

        $('.modal-window').css('zIndex', -1);

        $('.modal-background').css({
            zIndex: -1,
            opacity: 0
        });
    });

    function startGame() {
        clearInterval(countingInterval);
        $('.btn-style-start').removeAttr('disabled');
        $('.btn-style-check').attr('disabled', 'disabled');
        $('.timer-block').html(`01:00`);

        const rangeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].sort(() => 0.5 - Math.random());
        
        $('.puzzle-left').html('');
        rangeArr.forEach((num) => {
            $('.puzzle-left').append(`<div class="puzzle-elem_${num} puzzle-elem" data-number="${num}"></div>`)
        });
        
        $('.puzzle-elem').draggable({
            snap: '.puzzle-elem-right',
            snapMode: 'inner',
            snapTolerance: 30,
        });
    
        $('.puzzle-elem-right').droppable({
            accept: '.puzzle-elem'
        });
    
        $('.puzzle-elem').on('dragstart', function(event)  {
            currentPuzzleNumber = $(event.target).data('number');
        });
    }


    function checkResult() {
        clearInterval(countingInterval);
        $('.btn-style-check').attr('disabled', 'disabled');

        let isPuzzleCorrect = true;

        $('.puzzle-elem-right').each(function() {
            if ($(this).data('number') !== $(this).data('puzzle')) {
                isPuzzleCorrect = false;
            }
        });

        if (isPuzzleCorrect) {
            $('.modal-window-inner-text').html(`You Won!`);
        } else {
            $('.modal-window-inner-text').html(`It's a pity, but you lost`);
        }

        $('.modal-btn-check').remove();
    }


    $('.modal-btn-check').on('click', checkResult);



    $('.btn-style-new-game').on('click', startGame);

    $('.puzzle-elem-right').on('drop', function(event) {
        $(event.target).attr('data-puzzle', currentPuzzleNumber);
    });
    startGame();
});