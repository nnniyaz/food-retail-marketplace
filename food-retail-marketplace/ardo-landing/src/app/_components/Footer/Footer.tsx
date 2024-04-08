import {Langs} from "@/domain/mlString/mlString";
import {translate} from "@/pkg/translate/translate";
import LinkedinSVG from "@assets/linkedin.svg";
import WhatsAppSVG from "@assets/whatsapp.svg";
import LogoSymbolSVG from "@assets/logo-symbol.svg";
import classes from "./Footer.module.scss";
import {headers} from "next/headers";

export default function Footer() {
    const headersList = headers();
    return (
        <footer className={classes.footer}>
            <div className={classes.footer__group}>
                <div className={classes.footer__sub__group}>
                    <a
                        className={classes.footer__sub__group__item}
                        href={"https://www.linkedin.com/company/ardo-group-limited"}
                        rel={"noreferrer"}
                        target={"_blank"}
                    >
                        <LinkedinSVG/>
                    </a>
                    <a
                        className={classes.footer__sub__group__item}
                        href={"https://api.whatsapp.com/send?phone=85267954658"}
                        rel={"noreferrer"}
                        target={"_blank"}
                    >
                        <WhatsAppSVG/>
                    </a>
                    <a
                        className={classes.footer__sub__group__item}
                        href={"https://app.ardogroup.org"}
                        rel={"external"}
                        target={"_blank"}
                    >
                        <LogoSymbolSVG/>
                    </a>
                    <div className={classes.footer__sub__group__item}>
                        <p>{translate("contact_us", headersList.get("x-pathname")?.split("/")?.[2]?.toUpperCase() as Langs)}</p>
                        <div className={classes.footer__sub__group__item__contacts}>
                            <div className={classes.footer__sub__group__item__contacts__item}>
                                <p>{translate("email", headersList.get("x-pathname")?.split("/")?.[2]?.toUpperCase() as Langs)}</p>
                                <a href={"mailto:info@ardogroup.org"}>info@ardogroup.org</a>
                            </div>
                            <div className={classes.footer__sub__group__item__contacts__item}>
                                <p>{translate("phone", headersList.get("x-pathname")?.split("/")?.[2]?.toUpperCase() as Langs)}</p>
                                <a href={"tel:+852 6795 4658"}>+852 6795 4658</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.footer__group}>
                <p>Ardo Group Ltd.</p>
                <p>{`© 2023. ${translate("all_rights_reserved", headersList.get("x-pathname")?.split("/")?.[2]?.toUpperCase() as Langs)}.`}</p>
            </div>
        </footer>
    )
}
