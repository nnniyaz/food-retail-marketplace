import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import {IBlock} from "../../models/IBlock";
// import Logo from "../../assets/icons/logo.svg";
// import FullLogo from "../../assets/icons/full-logo.svg";
// import Mail from "../../assets/icons/mail.svg";
// import Phone from "../../assets/icons/phone.svg";
// import ArrowRight from "../../assets/icons/arrow-right.svg";
import classes from './index.module.scss';

const Sidebar = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    const [selectedBlock, setSelectedBlock] = React.useState<number>(0);

    const blocks: any = [
        // {id: 0, name: txt.start[currentLang]},
        // {id: 1, name: txt.services[currentLang]},
        // {id: 2, name: txt.cases[currentLang]},
        // {id: 3, name: txt.our_partners[currentLang]},
        // {id: 4, name: txt.how_it_works[currentLang]},
        // {id: 5, name: txt.we_in_social_networks[currentLang]},
        // {id: 6, name: txt.about_us[currentLang]},
    ];

    return (
        <div className={classes.side__bar}>
            <div className={classes.block__head}>
                <div className={classes.block__row}>
                    <div className={classes.block__row__group}>
                        {/*<Logo className={classes.block__row__group__short__logo}/>*/}
                        {/*<FullLogo className={classes.block__row__group__long__logo}/>*/}
                    </div>

                    <div className={classes.block__row__group}>
                        {/*<Mail*/}
                        {/*    color={'#005FF9'}*/}
                        {/*    className={classes.block__row__group__icon__block}*/}
                        {/*/>*/}
                        {/*<Phone*/}
                        {/*    color={'#005FF9'}*/}
                        {/*    className={classes.block__row__group__icon__block}*/}
                        {/*/>*/}

                        <div className={classes.block__row__group__btn}>
                            <div className={classes.block__row__group__btn__text}>
                                {/*{txt.price[currentLang]}*/}
                            </div>
                            {/*<ArrowRight*/}
                            {/*    color={'#FFFFFF'}*/}
                            {/*    className={classes.block__row__group__btn__icon}*/}
                            {/*/>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.block}>
                {
                    blocks.map((block: any) => (
                        <div
                            key={block.id}
                            className={classes.block__row}
                            style={{backgroundColor: selectedBlock === block.id ? '#DDEAFF' : ''}}
                            onClick={() => setSelectedBlock(block.id)}
                        >
                            <div className={classes.block__row__group}>
                                {
                                    selectedBlock === block.id
                                        ? <div className={classes.block__row__group__radio__active}></div>
                                        : <div className={classes.block__row__group__radio}></div>
                                }
                                <div className={classes.block__row__group__text}>
                                    {block.name}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={classes.block__bottom}>
                <div className={classes.block__bottom__title}>
                    {/*{txt.calculate_project_cost[currentLang]}*/}
                </div>
                <div className={classes.block__bottom__text}>
                    {/*{txt.calculate_project_cost_text[currentLang]}*/}
                </div>
                <div className={classes.block__bottom__btn}>
                    <div className={classes.block__bottom__btn__text}>
                        {/*{txt.calculate_cost[currentLang]}*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
