import React, {useMemo} from 'react';
// import {txt} from "../../assets/resources/txt";
// import {Pagination} from "swiper";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import {Swiper, SwiperSlide} from 'swiper/react';
import kami from "../../assets/imgs/kami-logo.png";
import phones from "../../assets/imgs/phones.png";
import phonesMobile from "../../assets/imgs/phones-mobile.png";
// import {ReactComponent as ArrowRight} from "../../assets/icons/arrow-right.svg";
import classes from './index.module.scss';

const Slider = () => {
    const windowWidth = window.innerWidth;

    // const {currentLang} = useTypedSelector(state => state.lang);

    const [swiper, setSwiper] = React.useState<any>(null);
    const [currentSlide, setCurrentSlide] = React.useState<number>(0);
    const slideTo = (index: number) => {
        swiper.slideTo(index);
        setCurrentSlide(index);
    }

    const casePictures = useMemo(() => windowWidth > 1200 ? phones : phonesMobile, [windowWidth])

    return (
        <div className={classes.block}>
            <div className={classes.swiper__pagination}>
                {
                    swiper?.slides?.length && (
                        swiper?.slides?.map((item: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => slideTo(index)}
                                className={
                                    (swiper && currentSlide === index)
                                        ? classes.swiper__pagination__bullet__active
                                        : classes.swiper__pagination__bullet
                                }
                            ></div>
                        ))
                    )
                }
            </div>
            {/*<Swiper*/}
            {/*    spaceBetween={30}*/}
            {/*    modules={[Pagination]}*/}
            {/*    onSwiper={setSwiper}*/}
            {/*    onActiveIndexChange={(swiper: any) => setCurrentSlide(swiper.activeIndex)}*/}
            {/*    className={classes.swiper}*/}
            {/*>*/}
            {/*    <SwiperSlide>*/}
            {/*        <div className={classes.slide}>*/}
            {/*            <div className={classes.slide__row}>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <img*/}
            {/*                            src={kami}*/}
            {/*                            className={classes.slide__group__logo}*/}
            {/*                            alt={'kami'}*/}
            {/*                        />*/}
            {/*                        <div className={classes.slide__group__title}>*/}
            {/*                            {'Kami QR'}*/}
            {/*                        </div>*/}
            {/*                        <div className={classes.slide__group__text}>*/}
            {/*                            {'Цифровое меню для заведений'}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <div className={classes.slide__group__btn}>*/}
            {/*                            <div className={classes.slide__group__btn__text}>*/}
            {/*                                {txt.see_project[currentLang]}*/}
            {/*                            </div>*/}
            {/*                            <ArrowRight*/}
            {/*                                color={'#212121'}*/}
            {/*                                className={classes.slide__group__btn__icon}*/}
            {/*                            />*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <img*/}
            {/*                        src={casePictures}*/}
            {/*                        className={classes.slide__group__img}*/}
            {/*                        alt={'phones'}*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </SwiperSlide>*/}
            {/*    <SwiperSlide>*/}
            {/*        <div className={classes.slide}>*/}
            {/*            <div className={classes.slide__row}>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <img*/}
            {/*                            src={kami}*/}
            {/*                            className={classes.slide__group__logo}*/}
            {/*                            alt={'kami'}*/}
            {/*                        />*/}
            {/*                        <div className={classes.slide__group__title}>*/}
            {/*                            {'Kami QR'}*/}
            {/*                        </div>*/}
            {/*                        <div className={classes.slide__group__text}>*/}
            {/*                            {'Цифровое меню для заведений'}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <div className={classes.slide__group__btn}>*/}
            {/*                            <div className={classes.slide__group__btn__text}>*/}
            {/*                                {txt.see_project[currentLang]}*/}
            {/*                            </div>*/}
            {/*                            <ArrowRight*/}
            {/*                                color={'#212121'}*/}
            {/*                                className={classes.slide__group__btn__icon}*/}
            {/*                            />*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <img*/}
            {/*                        src={casePictures}*/}
            {/*                        className={classes.slide__group__img}*/}
            {/*                        alt={'phones'}*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </SwiperSlide>*/}
            {/*    <SwiperSlide>*/}
            {/*        <div className={classes.slide}>*/}
            {/*            <div className={classes.slide__row}>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <img*/}
            {/*                            src={kami}*/}
            {/*                            className={classes.slide__group__logo}*/}
            {/*                            alt={'kami'}*/}
            {/*                        />*/}
            {/*                        <div className={classes.slide__group__title}>*/}
            {/*                            {'Kami QR'}*/}
            {/*                        </div>*/}
            {/*                        <div className={classes.slide__group__text}>*/}
            {/*                            {'Цифровое меню для заведений'}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <div className={classes.slide__group__btn}>*/}
            {/*                            <div className={classes.slide__group__btn__text}>*/}
            {/*                                {txt.see_project[currentLang]}*/}
            {/*                            </div>*/}
            {/*                            <ArrowRight*/}
            {/*                                color={'#212121'}*/}
            {/*                                className={classes.slide__group__btn__icon}*/}
            {/*                            />*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <img*/}
            {/*                        src={casePictures}*/}
            {/*                        className={classes.slide__group__img}*/}
            {/*                        alt={'phones'}*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </SwiperSlide>*/}
            {/*    <SwiperSlide>*/}
            {/*        <div className={classes.slide}>*/}
            {/*            <div className={classes.slide__row}>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <img*/}
            {/*                            src={kami}*/}
            {/*                            className={classes.slide__group__logo}*/}
            {/*                            alt={'kami'}*/}
            {/*                        />*/}
            {/*                        <div className={classes.slide__group__title}>*/}
            {/*                            {'Kami QR'}*/}
            {/*                        </div>*/}
            {/*                        <div className={classes.slide__group__text}>*/}
            {/*                            {'Цифровое меню для заведений'}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={classes.slide__group__team}>*/}
            {/*                        <div className={classes.slide__group__btn}>*/}
            {/*                            <div className={classes.slide__group__btn__text}>*/}
            {/*                                {txt.see_project[currentLang]}*/}
            {/*                            </div>*/}
            {/*                            <ArrowRight*/}
            {/*                                color={'#212121'}*/}
            {/*                                className={classes.slide__group__btn__icon}*/}
            {/*                            />*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className={classes.slide__group}>*/}
            {/*                    <img*/}
            {/*                        src={casePictures}*/}
            {/*                        className={classes.slide__group__img}*/}
            {/*                        alt={'phones'}*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </SwiperSlide>*/}
            {/*</Swiper>*/}
        </div>
    );
};

export default Slider;
