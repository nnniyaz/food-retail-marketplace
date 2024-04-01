import Block from "@/app/_components/Block/Block";
import Header from "@/app/_components/Header/Header";
import Footer from "@/app/_components/Footer/Footer";
import ArrowRightSVG from "@/app/_assets/arrow-right.svg";
import ListSVG from "@/app/_assets/clipboard-list.svg";
import CubeSVG from "@/app/_assets/cube.svg";
import CurrencySVG from "@/app/_assets/currency-dollar.svg";
import classes from './page.module.scss';

export default function Main() {
    return (
        <div className={classes.main}>
            <div className={classes.container}>
                <div className={classes.container__inner}>
                    <Header/>
                    <main className={classes.content}>
                        <Block id={"home"} height={"auto"} padding={"0"}>
                            <div className={classes.block__content}>
                                <div className={classes.block__group}>
                                    <div>
                                        <h1>FROM WASTE TO VALUE</h1>
                                        <p>
                                            ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best
                                            prices.
                                        </p>
                                    </div>
                                    <button>
                                        <span>{"Get Started"}</span>
                                        <ArrowRightSVG color={'#212121'} className={classes.btn__icon}/>
                                    </button>
                                </div>
                                <div className={classes.block__group}>
                                    <img
                                        src={"/products.png"}
                                        width={100}
                                        height={100}
                                        alt={"Ardo products cards"}
                                        className={classes.products_cards}
                                    />
                                </div>
                            </div>
                        </Block>
                        <Block id={"about"} height={"auto"} padding={"0"}>
                            <div className={classes.block__inner}>
                                <div className={classes.block__inner__group}>
                                    <div className={classes.block__inner__group__content}>
                                        <div className={classes.block__inner__group__content__title}>
                                            {"Wasted every day on unsold foods"}
                                        </div>

                                        <div className={classes.block__inner__group__content__body}>
                                            {"HK$200 000 000"}
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.block__inner__group}>
                                    <div className={classes.block__inner__group__sub__content}>
                                        <div className={classes.block__inner__group__sub__content__body}>
                                            {"3 300 000 kg"}
                                        </div>
                                        <div className={classes.block__inner__group__sub__content__title}>
                                            {"of food is dispatched at landfills daily"}
                                        </div>
                                    </div>
                                    <div className={classes.block__inner__group__sub__content}>
                                        <div className={classes.block__inner__group__sub__content__body}>
                                            {"30%"}
                                        </div>
                                        <div className={classes.block__inner__group__sub__content__title}>
                                            {"surplus in food produced can be sold through ARDO"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Block>
                        <Block id={"services"} height={"auto"} padding={"0"}>
                            <div className={classes.block}>
                                <div className={classes.block__profitability__group}>
                                    <h2>PROFITABILITY</h2>
                                    <p>
                                        Increase your liquidity by selling its shopkeepers and avoiding additional
                                        disposal or
                                        storage costs. <span
                                        style={{color: "rgb(63, 134, 0)", fontWeight: "600"}}>Reduce</span> your monthly
                                        costs by <span style={{
                                        color: "rgb(63, 134, 0)",
                                        fontWeight: "600",
                                        textDecoration: "underline"
                                    }}>12%</span> on average.
                                    </p>
                                </div>
                                <div className={classes.block__profitability__group}>
                                    <img
                                        className={classes.block__profitability__group__img}
                                        src={"/pricetag.png"}
                                        alt={"Price"}
                                    />
                                </div>
                            </div>
                        </Block>
                        <Block id={"partners"} height={"auto"} padding={"0"}>
                            <div className={classes.block}>
                                <div className={classes.block__data__proven__pricing__group}>
                                    <img
                                        className={classes.block__data__proven__pricing__group__img}
                                        src={"/folder.png"}
                                        alt={"Folder"}
                                    />
                                </div>
                                <div className={classes.block__data__proven__pricing__group}>
                                    <h2>DATA-PROVEN PRICING STRATEGIES</h2>
                                    <p>
                                        Our platform automatically generates the <span style={{color: "#005ff9"}}>best prices</span> for
                                        your on-sale items. You simply upload the items, we take <span
                                        style={{color: "#005ff9"}}>care</span> of the rest!
                                    </p>
                                </div>
                            </div>
                        </Block>
                        <Block id={"contacts"} height={"auto"} padding={"0"}>
                            <div className={classes.block}>
                                <div className={classes.block__customer__support__group}>
                                    <h2>24/7 CUSTOMER SUPPORT</h2>
                                    <p>
                                        Spend <span style={{color: "#005ff9"}}>less</span> time promoting your product,
                                        generate <span style={{color: "#005ff9"}}>free</span> leads, <span
                                        style={{color: "#005ff9"}}>reduce</span> order-processing time, and <span
                                        style={{color: "#005ff9"}}>open</span> your doors to dozens of restaurants at
                                        ARDO.
                                    </p>
                                </div>
                                <div className={classes.block__customer__support__group}>
                                    <img
                                        className={classes.block__customer__support__group__img}
                                        src={"/clock.png"}
                                        alt={"Clock"}
                                    />
                                </div>
                            </div>
                        </Block>
                        <Block id={"contacts"} height={"auto"} padding={"0"}>
                            <div className={classes.block}>
                                <div className={classes.block__step__by__step__group}>
                                    <h2>STEP-BY-STEP GUIDE</h2>
                                    <div className={classes.block__step__by__step__group__icons}>
                                        <div className={classes.block__step__by__step__group__icon__item}>
                                            <div className={classes.block__step__by__step__group__icon}>
                                                <ListSVG/>
                                            </div>
                                            <span>{"FILL THE FORM"}</span>
                                        </div>
                                        <div className={classes.block__step__by__step__group__icon__item}>
                                            <div className={classes.block__step__by__step__group__icon}>
                                                <CubeSVG/>
                                            </div>
                                            <span>{"UPLOAD YOUR SURPLUS"}</span>
                                        </div>
                                        <div className={classes.block__step__by__step__group__icon__item}>
                                            <div className={classes.block__step__by__step__group__icon}>
                                                <CurrencySVG/>
                                            </div>
                                            <span>{"RECEIVE ORDERS"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Block>
                        <Block id={"contacts"} height={"auto"} padding={"0"}>
                            <div className={classes.block}>
                                <div className={classes.block__call__to__action__group}>
                                    <h2>RISK FREE PAYMENT GUARANTEE</h2>
                                    <p>
                                        Receive invoices settled <span style={{color: "#005ff9"}}>prior</span> to
                                        shipment. <span style={{color: "#005ff9"}}>Stop</span> chasing your
                                        payments! <span style={{color: "#005ff9"}}>Zero</span> Hassle, <span
                                        style={{color: "#005ff9"}}>Zero</span> Risk with ARDO.
                                    </p>
                                    <button>
                                        <span>{"Get Started"}</span>
                                        <ArrowRightSVG className={classes.btn__icon}/>
                                    </button>
                                </div>
                            </div>
                        </Block>
                    </main>
                </div>
                <Footer/>
            </div>
        </div>
    );
}
