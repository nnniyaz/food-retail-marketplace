import React from 'react';
// import {txt} from "../../assets/resources/txt";
// import {useTypedSelector} from "../../hooks/useTypedSelector";
// import partner1 from '../../assets/imgs/partner-1.png';
// import partner2 from '../../assets/imgs/partner-2.png';
// import partner3 from '../../assets/imgs/partner-3.png';
// import partner4 from '../../assets/imgs/partner-4.png';
// import partner5 from '../../assets/imgs/partner-5.png';
// import partner6 from '../../assets/imgs/partner-6.png';
// import partner7 from '../../assets/imgs/partner-7.png';
// import partner8 from '../../assets/imgs/partner-8.png';
// import partner9 from '../../assets/imgs/partner-9.png';
import classes from './index.module.scss';

const Partners = () => {
    // const {currentLang} = useTypedSelector(state => state.lang);

    const partners: any = [
        // {id: '01', img: partner1},
        // {id: '02', img: partner2},
        // {id: '03', img: partner3},
        // {id: '04', img: partner4},
        // {id: '05', img: partner5},
        // {id: '06', img: partner6},
        // {id: '07', img: partner7},
        // {id: '08', img: partner8},
        // {id: '09', img: partner9},
    ];

    return (
        <div className={classes.block}>
            <div className={classes.block__title}>
                {/*{txt.our_partners[currentLang]}*/}
            </div>

            <div className={classes.block__column}>
                <div className={classes.block__row}>
                    {
                        partners.slice(0, 3).map((partner: any) => (
                            <div className={classes.block__grid__item} key={partner.id}>
                                <div className={classes.block__grid__item__index}>{partner.id}</div>
                                <img src={partner.img} className={classes.block__grid__item__img} alt={'partner'}/>
                            </div>
                        ))
                    }
                </div>
                <div className={classes.block__row}>
                    {
                        partners.slice(3, 6).map((partner: any) => (
                            <div className={classes.block__grid__item} key={partner.id}>
                                <div className={classes.block__grid__item__index}>{partner.id}</div>
                                <img src={partner.img} className={classes.block__grid__item__img} alt={'partner'}/>
                            </div>
                        ))
                    }
                </div>
                <div className={classes.block__row}>
                    {
                        partners.slice(6, 9).map((partner: any) => (
                            <div className={classes.block__grid__item} key={partner.id}>
                                <div className={classes.block__grid__item__index}>{partner.id}</div>
                                <img src={partner.img} className={classes.block__grid__item__img} alt={'partner'}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Partners;
