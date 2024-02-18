import React from 'react';
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import logo from '../../assets/imgs/logo.png';
import classes from './index.module.scss';

const Footer = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    return (
        <div className={classes.main}>
            <div className={classes.main__group}>
                <img src={""} className={classes.main__group__img} alt={'logo'}/>
            </div>
            <div className={classes.main__group}>
                <div className={classes.main__group__title}>Свяжитесь с нами.</div>
                <div className={classes.main__group__text}>
                    Разрабатываем красивый и интуитивно-понятный интерфейс, чтобы облегчить жизнь пользователю
                </div>
                <div className={classes.main__group__columns}>
                    <div className={classes.main__group__column}>
                        <div className={classes.main__group__column__title}>
                            <div className={classes.main__group__column__title__circle}></div>
                            <div className={classes.main__group__column__title__text}>Социальные сети</div>
                        </div>
                        <div className={classes.main__group__column__text}>Instagram</div>
                        <div className={classes.main__group__column__text}>Telegram</div>
                        <div className={classes.main__group__column__text}>Whatsapp</div>
                    </div>
                    <div className={classes.main__group__column}>
                        <div className={classes.main__group__column__title}>
                            <div className={classes.main__group__column__title__circle}></div>
                            <div className={classes.main__group__column__title__text}>Сайт</div>
                        </div>
                        <div className={classes.main__group__column__text}>Услуги</div>
                        <div className={classes.main__group__column__text}>Кейсы</div>
                        <div className={classes.main__group__column__text}>О нас</div>
                    </div>
                    <div className={classes.main__group__column}>
                        <div className={classes.main__group__column__title}>
                            <div className={classes.main__group__column__title__circle}></div>
                            <div className={classes.main__group__column__title__text}>Контакты</div>
                        </div>
                        <div className={classes.main__group__column__text}>+7 777 323 4343</div>
                        <div className={classes.main__group__column__text}>info@reformare.kz</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
