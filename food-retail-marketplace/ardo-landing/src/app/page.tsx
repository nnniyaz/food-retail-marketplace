import Sidebar from "@/components/Sidebar";
import Slider from "@/components/Slider";
import Services from "@/components/Services";
import Cases from "@/components/Cases";
import Partners from "@/components/Partners";
import WorkingHours from "@/components/WorkingHours";
import Life from "@/components/Life";
import AboutUs from "@/components/AboutUs";
import LetsWork from "@/components/LetsWork";
import Footer from "@/components/Footer";
import classes from './page.module.scss';

export default function Home() {
  return (
      <div className={classes.main}>
        <div className={classes.container}>
          <div className={classes.wrapper}>
            <Sidebar/>
            <div className={classes.content}>
              <Slider/>
              <Services/>
              <Cases/>
              <Partners/>
              <WorkingHours/>
              <Life/>
              <AboutUs/>
              <LetsWork/>
            </div>
          </div>
          <Footer/>
        </div>
      </div>
  );
}
