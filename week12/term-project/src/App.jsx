import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import AmenitiesSection from './components/AmenitiesSection';
import ConditionsSnapshot from './components/ConditionsSnapshot';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import './App.css';

const property = {
  name: "Hale Ōhiʻa Lehua",
  island: "Hawaiʻi Island",
  tagline: "Connect with Kīlauea through experience, knowledge, and myth.",
  imageURL: "/images/hero.jpg",
  about: "Hale Ōhiʻa Lehua is a science retreat and hospitality property situated at the edge of an ōhiʻa forest near Hawaiʻi Volcanoes National Park. Guided by the principle of Two-Eyed Seeing, we welcome both Western scientific inquiry and traditional Hawaiian knowledge as equally valid lenses for understanding this place. Whether you are here to research, to wander, or simply to witness, Kīlauea will meet you where you are.",
  amenities: [
    { id: 1, name: "Crater Shuttle & Gear", description: "Complimentary shuttle to the crater with protective gear including masks, eye protection, hats, and ponchos." },
    { id: 2, name: "Workshops Included", description: "All workshop and guest speaker attendance is included in your accommodation price." },
    { id: 3, name: "Farm-to-Table Dining", description: "On-site restaurant serving locally sourced breakfast, lunch, and dinner daily." },
    { id: 4, name: "Late Night Lounge", description: "Beverages and pupus available nightly until 10 PM." },
    { id: 5, name: "Ōhiʻa Forest Trails", description: "Clearly marked trails through the ōhiʻa forest ranging in distance and difficulty." },
    { id: 6, name: "Complimentary Laundry", description: "In-house laundry service included with every stay." },
    { id: 7, name: "Wellness Facilities", description: "On-site cold plunge, hot tub, and sauna available to all guests." },
    { id: 8, name: "Flexible Accommodations", description: "Options ranging from single rooms to connected suites." },
    { id: 9, name: "Partner Excursions", description: "When crater conditions are unfavorable, shuttles to partner destinations and discounted car rentals are available." },
    { id: 10, name: "Research Lounge", description: "Dedicated research rooms available for per-hour booking." },
  ],
  alertLevel: "ADVISORY",
  alertMessage: "Kīlauea is currently at Advisory level. Intermittent lava fountaining reported at Halemaʻumaʻu. Crater access open with caution.",
  bookingEmail: "stay@haleohialehua.com",
  researchEmail: "research@haleohialehua.com",
};

function App() {
  return (
    <div className="app">
      <Header />
      <HeroSection
        name={property.name}
        island={property.island}
        tagline={property.tagline}
        imageURL={property.imageURL}
      />
      <AboutSection about={property.about} />
      <AmenitiesSection amenities={property.amenities} />
      <ConditionsSnapshot
        alertLevel={property.alertLevel}
        alertMessage={property.alertMessage}
      />
      <CTASection
        bookingEmail={property.bookingEmail}
        researchEmail={property.researchEmail}
      />
      <Footer />
    </div>
  );
}

export default App;