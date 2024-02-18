import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import {priceWithSpacesAndCurrency} from "../../utils";
import classes from "./index.module.scss";

const WorkingHours = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    const specialists: any = [
        // {
        //     id: 1,
        //     title: txt.art_director[currentLang],
        //     price: 10000,
        //     ratioLabel: txt.art_dir[currentLang],
        //     percentLabel: '15-25%',
        //     percent: 0.25
        // },
        // {
        //     id: 2,
        //     title: txt.middle_dis[currentLang],
        //     price: 8000,
        //     ratioLabel: txt.designer[currentLang],
        //     percentLabel: '40-50%',
        //     percent: 0.45
        // },
        // {
        //     id: 3,
        //     title: txt.dis_fighter[currentLang],
        //     price: 5000,
        //     ratioLabel: txt.junior[currentLang],
        //     percentLabel: '20-30%',
        //     percent: 0.3
        // },
    ];

    return (
        <div className={classes.block}>
            <div className={classes.block__title}>
                {/*{txt.we_work_by_hours[currentLang]}*/}
            </div>

            <div className={classes.block__row}>
                {
                    specialists.map((specialist: any) => (
                        <div className={classes.block__card} key={specialist.id}>
                            <div className={classes.block__card__title}>{specialist.title}</div>
                            <div className={classes.block__card__price}>
                                <span className={classes.block__card__price}>
                                    {/*{priceWithSpacesAndCurrency(specialist.price, '₸')}*/}
                                </span>
                                <span className={classes.block__card__price__details}>
                                    {/*{'/' + txt.hour[currentLang]}*/}
                                </span>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className={classes.block__text}>
                {/*{txt.we_work_by_hours__text[currentLang]}*/}
            </div>

            <div className={classes.block__ratios}>
                {
                    specialists.map((ratio: any) => (
                        <div
                            key={ratio.id}
                            className={classes.block__ratio}
                            style={{width: `calc((100% - 40px) * ${ratio.percent})`}}
                        >
                            <div className={classes.block__ratio__bar}></div>
                            <div className={classes.block__ratio__title}>{ratio.ratioLabel}</div>
                            <div className={classes.block__ratio__percent}>{ratio.percentLabel}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default WorkingHours;
