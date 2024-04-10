import Image from "next/image";
import {Langs} from "@/domain/mlString/mlString";
import {translate} from "@/pkg/translate/translate";
import classes from './MainBlock.module.scss';
import ButtonForm from "@components/MainBlock/_components/ButtonForm/ButtonForm";

interface MainBlockProps {
    lang: Langs
    isSupplierPage: boolean
}

export default function MainBlock({lang, isSupplierPage}: MainBlockProps) {
    return (
        <section className={classes.main_block}>
            <div className={classes.main_block__group}>
                <h1>
                    {
                        isSupplierPage
                            ? translate("welcome_text_suppliers", lang)
                            : translate("welcome_text_restaurants", lang)
                    }
                </h1>
                <div className={classes.main_block__group__products}>
                    <Image
                        className={classes.main_block__group__products__item}
                        src={"https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/meat-1.png"}
                        alt={"Meat Product Example"}
                        width={0}
                        height={0}
                        unoptimized={true}
                    />
                    <Image
                        className={classes.main_block__group__products__item}
                        src={"https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/meat-2.png"}
                        alt={"Meat Product Example"}
                        width={0}
                        height={0}
                        unoptimized={true}
                    />
                    <Image
                        className={classes.main_block__group__products__item}
                        src={"https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/meat-3.webp"}
                        alt={"Meat Product Example"}
                        width={0}
                        height={0}
                        unoptimized={true}
                    />
                </div>
                <p>{translate("welcome_sub_text", lang)}</p>
                <ButtonForm lang={lang}/>
            </div>
            <div className={classes.main_block__group}>
                <Image
                    className={classes.main_block__group__banner}
                    src={
                        isSupplierPage
                            ? "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/prototype.png"
                            : "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/prototype-restaurants.png"
                    }
                    alt={"Prototype of the Web Application"}
                    width={0}
                    height={0}
                    unoptimized={true}
                />
            </div>
        </section>
    )
}
