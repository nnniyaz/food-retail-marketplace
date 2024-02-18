import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import {ReactComponent as Link} from "../../assets/icons/link.svg";
// import {ReactComponent as Instagram} from "../../assets/icons/ig.svg";
import classes from './index.module.scss';

const Life = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    const links: any = [
        // {
        //     id: 1,
        //     icon: <Instagram color={'#000000'}/>,
        //     text: 'Как забрать финтех-проект на пресейле без опыта в сфере. Личный опыт дизайн-студии'
        // },
        // {
        //     id: 2,
        //     icon: <Instagram color={'#000000'}/>,
        //     text: 'Как забрать финтех-проект на пресейле без опыта в сфере. Личный опыт дизайн-студии'
        // },
        // {id: 3, icon: <Instagram color={'#000000'}/>, text: 'Как увеличить конверсию в заявку на сервисе автозаймов?'},
        // {id: 4, icon: <Instagram color={'#000000'}/>, text: 'Как увеличить конверсию в заявку на сервисе автозаймов?'},
        // {id: 5, icon: <Instagram color={'#000000'}/>, text: 'Как увеличить конверсию в заявку на сервисе автозаймов?'},
        // {id: 6, icon: <Instagram color={'#000000'}/>, text: 'Как увеличить конверсию в заявку на сервисе автозаймов?'},
    ]

    return (
        <div className={classes.block}>
            <div className={classes.block__title}>
                {/*{txt.we_share_experience_and_studio_life[currentLang]}*/}
            </div>

            <div className={classes.block__grid}>
                {
                    links.map((link: any) => (
                        <div className={classes.grid__item} key={link.id}>
                            <div className={classes.grid__item__head}>{link.icon}</div>
                            <div className={classes.grid__item__body}>{link.text}</div>
                            <div className={classes.grid__item__footer}>
                                <div className={classes.grid__item__footer__btn}>
                                    <div className={classes.grid__item__footer__btn__text}>
                                        {/*{txt.read[currentLang]}*/}
                                    </div>
                                    {/*<Link color={'#212121'} className={classes.grid__item__footer__btn__icon}/>*/}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Life;
