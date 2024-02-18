'use client';
import {useState} from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import classes from './Slider.module.scss';

export default function Slider() {
    const [swiper, setSwiper] = useState<any>(null);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const slideTo = (index: number) => {
        swiper.slideTo(index);
        setCurrentSlide(index);
    }

    const slides = [
        {id: 1, title: 'Slide 1'},
        {id: 2, title: 'Slide 2'},
        {id: 3, title: 'Slide 3'},
        {id: 4, title: 'Slide 4'},
        {id: 5, title: 'Slide 5'},
        {id: 6, title: 'Slide 6'},
        {id: 7, title: 'Slide 7'},
        {id: 8, title: 'Slide 8'},
        {id: 9, title: 'Slide 9'},
    ];

    return (
        <div className={classes.carousel__block}>
            <div className={classes.carousel__pagination}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={
                            (swiper && currentSlide === index)
                                ? classes.carousel__pagination__bullet__active
                                : classes.carousel__pagination__bullet
                        }
                        onClick={() => slideTo(index)}
                    ></div>
                ))}
            </div>
            <Swiper
                loop={true}
                spaceBetween={8}
                onSwiper={setSwiper}
                onActiveIndexChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
                modules={[Pagination]}
                className={classes.carousel}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index} className={classes.carousel__item}>
                        {slide.title}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
