import {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination, Navigation} from 'swiper';
import {translate} from "@pkg/translate/translate";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
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

    const {catalog} = useTypedSelector(state => state.catalogState);

    if (!catalog.slides.length) {
        return null;
    }
    return (
        <section className={classes.carousel}>
            <Swiper
                slidesPerView={windowWidth <= 800 ? 1 : 3}
                spaceBetween={15}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                style={{borderRadius: "12px"}}
            >
                {catalog.slides.map((slide) => (
                    <SwiperSlide key={slide._id} className={classes.carousel__item}>
                        <CarouselItem img={slide.img}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

const CarouselItem = ({img}) => {
    // const {currentLang, langs, cfg} = useTypedSelector(state => state.systemState);
    const {cfg} = useTypedSelector(state => state.systemState);
    const imgPath = `url('${cfg.assetsUri}/slides/${img}')`;
    // const isCaptionExist = Object.values(caption).some((value) => value !== "");
    return (
        <div className={classes.carousel__item__container} style={{backgroundImage: imgPath}}>
            {/*{*/}
            {/*    isCaptionExist && (*/}
            {/*        <div className={classes.carousel__item__inner__container}>*/}
            {/*            {translate(caption, currentLang, langs) ?? null}*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}
        </div>
    )
}
