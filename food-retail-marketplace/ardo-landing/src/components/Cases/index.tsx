import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import kami from '../../assets/imgs/kami-case.png';
// import kmf from '../../assets/imgs/kmf-case.png';
// import ctogramm from '../../assets/imgs/ctogram-case.png';
// import abchess from '../../assets/imgs/abchess-case.png';
// import {ReactComponent as ArrowRight} from "../../assets/icons/arrow-right.svg";
// import {ReactComponent as LinkCircleBlack} from "../../assets/icons/link-circle-black.svg";
import classes from './index.module.scss';

const Cases = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    const cases: any = [
        // {
        //     id: 1,
        //     title: 'Kami QR',
        //     field: txt.food[currentLang],
        //     text: txt.food_text[currentLang],
        //     img: kami
        // },
        // {
        //     id: 2,
        //     title: 'KMF Finance',
        //     field: txt.finance[currentLang],
        //     text: txt.finance_text[currentLang],
        //     img: kmf
        // },
        // {
        //     id: 3,
        //     title: 'СТОgram',
        //     field: txt.auto[currentLang],
        //     text: txt.auto_text[currentLang],
        //     img: ctogramm
        // },
        // {
        //     id: 4,
        //     title: 'ABchess',
        //     field: txt.chess[currentLang],
        //     text: txt.chess_text[currentLang],
        //     img: abchess
        // },
    ]

    return (
        <div className={classes.block}>
            <div className={classes.block__title}>
                {/*{txt.cases[currentLang]}*/}
                {/*<LinkCircleBlack className={classes.block__title__icon}/>*/}
            </div>

            <div className={classes.block__text}>
                {/*{txt.cases_text[currentLang]}*/}
            </div>

            <div className={classes.block__column}>
                {
                    cases.map((item: any) => (
                        <div className={classes.block__row} key={item.id}>
                            <div className={classes.block__row__group}>
                                <div className={classes.block__row__group__info}>
                                    <div className={classes.block__row__group__info__item}>{item.title}</div>
                                    <div className={classes.block__row__group__info__item}>{item.field}</div>
                                    <div className={classes.block__row__group__info__item}>{item.text}</div>
                                </div>
                                <div className={classes.block__row__group__btn}>
                                    <div className={classes.block__row__group__btn__text}>
                                        {/*{txt.see_project[currentLang]}*/}
                                    </div>
                                    {/*<ArrowRight color={'#212121'} className={classes.block__row__group__btn__icon}/>*/}
                                </div>
                            </div>
                            <img
                                src={item.img}
                                className={classes.block__row__preview}
                                alt={'preview'}
                            />
                        </div>
                    ))
                }
            </div>

            <div className={classes.block__cards}>
                {
                    cases.map((item: any) => (
                        <div className={classes.card} key={item.id}>
                            <img
                                src={item.img}
                                className={classes.card__preview}
                                alt={'preview'}
                            />
                            <div className={classes.card__body}>
                                <div className={classes.card__body__title}>
                                    <div className={classes.card__body__title__item}>{item.title}</div>
                                    <div className={classes.card__body__title__item}>{item.field}</div>
                                </div>

                                <div className={classes.card__body__text}>{item.text}</div>

                                <div className={classes.card__body__btn}>
                                    <div className={classes.card__body__btn__text}>
                                        {/*{txt.see_project[currentLang]}*/}
                                    </div>
                                    {/*<ArrowRight color={'#212121'} className={classes.card__body__btn__icon}/>*/}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Cases;
