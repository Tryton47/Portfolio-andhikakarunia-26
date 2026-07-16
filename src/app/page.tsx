import HeroSection from '@/components/HeroSection';
import ConsoleWidget from '@/components/ConsoleWidget';
import AboutSection from '@/components/AboutSection';
import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ConsoleWidget />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
    </>
  );
}
