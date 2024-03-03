import {useEffect, useState} from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import classes from "./Carousel.module.scss";

export const Carousel = () => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    return (
        <section className={classes.carousel}>
            <Swiper
                slidesPerView={windowWidth <= 800 ? 1 : 3}
                spaceBetween={windowWidth <= 800 ? 0 : 15}
                loop={true}
                pagination={{
                    clickable: true
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
            >
                <SwiperSlide className={classes.carousel__item}>Slide 1</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 2</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 3</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 4</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 5</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 6</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 7</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 8</SwiperSlide>
                <SwiperSlide className={classes.carousel__item}>Slide 9</SwiperSlide>
            </Swiper>
        </section>
    )
}
