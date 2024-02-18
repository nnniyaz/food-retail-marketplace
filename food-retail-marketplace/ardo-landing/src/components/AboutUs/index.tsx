import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import {priceWithSpacesAndCurrency} from "../../utils";
// import clock from '../../assets/imgs/clock.png';
// import measure from '../../assets/imgs/measure.png';
// import measureMobile from '../../assets/imgs/measure-mobile.png';
import classes from "./index.module.scss";

const AboutUs = () => {
    const windowWidth = window.innerWidth;
    // const {currentLang} = useTypedSelector(state => state.lang);

    const numberOfDesignForMobileInterfaces = 92;
    const menNumber = 6;
    const womenNumber = 3;

    return (
        <div className={classes.block}>
            <div className={classes.block__title}>
                {/*{txt.about_us_slang[currentLang]}*/}
                <span className={classes.block__title__inner}>(дзат анас?)</span>
            </div>

            <div className={classes.block__text}>
                <p>Встроимся в вашу команду, спроектируем интерфейсы, нарисуем дизайн, проведем</p>
                <p>исследования, займемся дизайн-поддержкой. Нас можно подключить на любом этапе.</p>
                <p>Студия — что-то вроде внешнего отдела дизайна, но с вовлеченностью инхаус команды.</p>
                <p>Любопытство — один из главных принципов студии. Благодаря ему можно найти другое,</p>
                <p>
                    настоящее решение, которое упустили другие. Поэтому, часто в работе задаемся вопросом «а что,
                    если...?»
                </p>
            </div>

            <div className={classes.block__inner}>
                <div className={classes.block__inner__group}>
                    <div className={classes.block__inner__group__content}>
                        <div className={classes.block__inner__group__content__title}>
                            {/*{txt.jobs_made_by[currentLang] + ' ре:формой'}*/}
                        </div>

                        <div className={classes.block__inner__group__content__body}>
                            {/*{priceWithSpacesAndCurrency(29200, '') + ' ' + txt.hours[currentLang]}*/}
                        </div>

                        {/*<img src={clock} className={classes.block__inner__group__content__img} alt={'clock'}/>*/}
                    </div>
                </div>
                <div className={classes.block__inner__group}>
                    <div className={classes.block__inner__group__sub__content}>
                        <div className={classes.block__inner__group__sub__content__title}>
                            {/*{txt.design_of_mobile_interfaces[currentLang]}*/}
                        </div>
                        <div className={classes.block__inner__group__sub__content__body}>
                            {/*<img*/}
                            {/*    src={windowWidth > 1200 ? measure : measureMobile}*/}
                            {/*    className={classes.block__inner__group__sub__content__body__img}*/}
                            {/*    alt={'measure'}*/}
                            {/*/>*/}
                            <div className={classes.block__inner__group__sub__content__body__text}>
                                {numberOfDesignForMobileInterfaces}
                            </div>
                        </div>
                    </div>
                    <div className={classes.block__inner__group__sub__content__wrapper}>
                        <div className={classes.block__inner__group__sub__content__wrapper__inner}>
                            <div className={classes.block__inner__group__sub__content__wrapper__inner__title}>
                                {/*{txt.men[currentLang]}*/}
                            </div>
                            <div className={classes.block__inner__group__sub__content__wrapper__inner__sub__title}>
                                {menNumber}
                            </div>
                        </div>
                        <div className={classes.block__inner__group__sub__content__wrapper__inner}>
                            <div className={classes.block__inner__group__sub__content__wrapper__inner__title}>
                                {/*{txt.women[currentLang]}*/}
                            </div>
                            <div className={classes.block__inner__group__sub__content__wrapper__inner__sub__title}>
                                {womenNumber}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
