var rangeSlider = function () {
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {

        value.each(function () {
            var value = $(this).prev().attr('value');
            var unit = $(this).prev()[0].getAttribute('unit');           
            
            $(this).html(value + unit);
        });

        range.on('input', function () {
            var unit = $(this)[0].getAttribute('unit')
            $(this).next(value).html(this.value + unit);
        });
    });
};

rangeSlider();