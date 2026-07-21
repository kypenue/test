export const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 1500,
    slidesToShow: 3.5,
    slidesToScroll: 3,
    draggable: true,
    swipe: true,
    touchMove: true,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 10000,
    responsive: [
        {
            breakpoint: 1440,
            settings: {
                slidesToShow: 3.5,
                slidesToScroll: 3,
                infinite: false,
            },
        },
        {
            breakpoint: 680,
            settings: {
                slidesToShow: 2.15,
                slidesToScroll: 1,
                initialSlide: 0,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1.12,
                slidesToScroll: 1,
            },
        },
    ],
};
