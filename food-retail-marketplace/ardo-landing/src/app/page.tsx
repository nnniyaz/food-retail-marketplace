import {txt} from "@/app/txt/txt";
import Block from "@/app/_components/Block/Block";
import Header from "@/app/_components/Header/Header";
import Footer from "@/app/_components/Footer/Footer";
import Slider from "@/app/_components/Slider/Slider";
import mainBg from "./assets/main_block.png";
import classes from './page.module.scss';

export default function Main() {
    return (
        <div className={classes.main}>
            <div className={classes.container}>
                <div className={classes.container__inner}>
                    <Header/>
                    <main className={classes.content}>
                        <Block id={"about"} height={"450px"}>
                            <div style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundImage: `url(${mainBg.src})`,
                                backgroundSize: "cover",
                                borderRadius: "10px",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "35%",
                                    transform: "translate(-50%, -50%)",
                                    width: "300px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                }}>
                                    <h1 style={{color: "white"}}>{txt["company_mission_title"].EN}</h1>
                                    <p style={{color: "white"}}>{txt["company_mission_subtitle"].EN}</p>
                                </div>
                            </div>
                        </Block>
                        <Block id={"home"} height={"450px"} padding={"0"}>
                            <Slider/>
                        </Block>
                        <Block id={"services"} title={txt["services"].EN} height={"450px"}>
                            <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae
                                quia. lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem,
                                quas quae quia</p>
                        </Block>
                        <Block id={"partners"} title={txt["partners"].EN} height={"450px"}>
                            <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae
                                quia. lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem,
                                quas quae quia</p>
                        </Block>
                        <Block id={"contacts"} title={txt["contacts"].EN} height={"450px"}>
                            <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae
                                quia. lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem,
                                quas quae quia</p>
                        </Block>
                    </main>
                </div>
                <Footer/>
            </div>
        </div>
    );
}
