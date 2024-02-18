import Block from "@/app/_components/Block/Block";
import Header from "@/app/_components/Header/Header";
import Footer from "@/app/_components/Footer/Footer";
import {txt} from "@/app/txt/txt";
import classes from './page.module.scss';
import Slider from "@/app/_components/Slider/Slider";

export default function Main() {
  return (
      <div className={classes.main}>
          <div className={classes.container}>
              <div className={classes.container__inner}>
                  <Header/>
                  <main className={classes.content}>
                      <Block id={"home"} height={"450px"} padding={"0"}>
                          <Slider/>
                      </Block>
                      <Block id={"about"} title={txt["about"].EN} height={"450px"}>
                          <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia. lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia</p>
                      </Block>
                      <Block id={"services"} title={txt["services"].EN} height={"450px"}>
                          <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia. lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia</p>
                      </Block>
                      <Block id={"partners"} title={txt["partners"].EN} height={"450px"}>
                          <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia. lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia</p>
                      </Block>
                      <Block id={"contacts"} title={txt["contacts"].EN} height={"450px"}>
                          <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia. lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci quos, quidem, quas quae quia</p>
                      </Block>
                  </main>
              </div>
              <Footer/>
          </div>
      </div>
  );
}
