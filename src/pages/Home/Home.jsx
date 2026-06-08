import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Brands from '../../components/Brands/Brands';
import Services from '../../components/Services/Services';
import Testimonials from '../../components/Testimonials/Testimonials';
import Footer from '../../components/Footer/Footer';
import bgVideo from '../../assets/VideoFondoMood.webm';
import './Home.scss';

const Home = () => {
  return (
    <main className='home'>
      <div className='home__hero-frame'>
        <video
          className='home__hero-video'
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src={bgVideo}
            type='video/webm'
          />
        </video>

        {/* 🌟 CAPA OSCURA DEGRADADA PARA RESALTAR EL TEXTO */}
        <div className='home__hero-overlay'></div>

        <div className='home__hero-content'>
          <Navbar />
          <Hero />
        </div>
      </div>

      <Brands />
      <Services />

      <div className='home__footer-area'>
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
