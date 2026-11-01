import { HeroSlider } from '../sections/home/HeroSlider.jsx';
import { HomeIntro } from '../sections/home/HomeIntro.jsx';
import { FlavorGrid } from '../sections/home/FlavorGrid.jsx';
import { WhyRifkus } from '../sections/home/WhyRifkus.jsx';
import { DistributorCta } from '../sections/home/DistributorCta.jsx';
import { Marquee } from '../components/Marquee.jsx';

/**
 * Home (owner decision: the measured one-screen hero, then
 * Intro, Flavors, Why Rifkus and the distributor CTA, built from the
 * reference's own section patterns. "Lines &
 * sizes", "Where to find us" and the FAQ moved off Home; their components
 * stay for the flavor, story and distributor pages.
 * Rhythm: a yellow flavor ticker under the intro, Why Rifkus as a yellow
 * band, then the CTA band on ink with a yellow button.
 */
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <HomeIntro />
      <Marquee />
      <FlavorGrid />
      <WhyRifkus band />
      <DistributorCta />
    </>
  );
}
