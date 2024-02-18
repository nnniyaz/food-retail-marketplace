import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import priceTag from '../../assets/imgs/pricetag.png';
// import folder from '../../assets/imgs/folder.png';
// import notes from '../../assets/imgs/notes.png';
// import clock from '../../assets/imgs/clock-small.png';
import classes from "./index.module.scss";

const LetsWork = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    const advantages: any = [
        // {
        //     id: 1,
        //     title: txt.personal_discount[currentLang],
        //     text: 'N% ' + txt.discount_for_project[currentLang],
        //     icon: priceTag
        // },
        // {id: 2, title: txt.file_transmission[currentLang], text: txt.collected_ui_kit[currentLang], icon: folder},
        // {id: 3, title: txt.task[currentLang], text: txt.mobile_design[currentLang], icon: notes},
        // {id: 4, title: txt.project_deadline[currentLang], text: txt.months_2_3[currentLang], icon: clock},
    ];

    return (
        <div className={classes.block}>
            <div className={classes.block__header}>
                <div className={classes.block__header__text}>
                    {/*{txt.lets_work_text[currentLang]}*/}
                </div>
                <div className={classes.block__header__btn}>
                    <div className={classes.block__header__btn__text}>
                        {/*{txt.calculate_cost[currentLang]}*/}
                    </div>
                </div>
            </div>

            <div className={classes.block__advantages}>
                {
                    advantages.map((item: any, index: number) => (
                        <div className={classes.block__advantage} key={index}>
                            <img src={item.icon} className={classes.block__advantage__group__img} alt={'icon'}/>
                            <div className={classes.block__advantage__group}>
                                <div className={classes.block__advantage__group__upper__text}>{item.title}</div>
                                <div className={classes.block__advantage__group__lower__text}>{item.text}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default LetsWork;
