import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
import projection from "../../assets/imgs/projection.png";
import research from "../../assets/imgs/research.png";
import support from "../../assets/imgs/support.png";
import outStuffing from "../../assets/imgs/out-stuffing.png";
// import {ReactComponent as LinkCircle} from "../../assets/icons/link-circle.svg";
import classes from "./index.module.scss";

const Services = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    const services: any = [
        // {
        //     id: 1,
        //     avatar: projection,
        //     title: txt.interface__projection[currentLang],
        //     text: txt.interface__projection_text[currentLang]
        // },
        // {
        //     id: 2,
        //     avatar: research,
        //     title: txt.research_ux[currentLang],
        //     text: txt.research_ux_text[currentLang]
        // },
        // {
        //     id: 3,
        //     avatar: support,
        //     title: txt.design_support[currentLang],
        //     text: txt.design_support_text[currentLang]
        // },
        // {
        //     id: 4,
        //     avatar: outStuffing,
        //     title: txt.out_stuffing[currentLang],
        //     text: txt.out_stuffing_text[currentLang]
        // }
    ];

    return (
        <div className={classes.block}>
            <div className={classes.block__title}>
                {/*{txt.services[currentLang]}*/}
            </div>

            <div className={classes.block__text}>
                {/*{txt.services_text[currentLang]}*/}
            </div>

            <div className={classes.block__grid}>
                {
                    services.map((service: any) => (
                        <div className={classes.block__grid__item} key={service.id}>
                            <div className={classes.block__grid__item__header}>
                                <img
                                    src={service.avatar}
                                    className={classes.block__grid__item__header__avatar}
                                    alt="avatar"
                                />
                                <div className={classes.block__grid__item__header__title}>
                                    {service.title}
                                </div>
                            </div>
                            <div className={classes.block__grid__item__text}>
                                {service.text}
                            </div>
                            <div className={classes.block__grid__item__footer}>
                                {/*<LinkCircle className={classes.block__grid__item__footer__icon}/>*/}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Services;
