import React from 'react';
import HeroSection from './sections/HeroSection';
import GallerySection from './sections/GallerySection';
import MapSection from './sections/MapSection';
import CTASection from './sections/CTASection';
import Navbar from '../core/Navbar';
import Footer from '../core/Footer';
import FacilitySection from './sections/FacilitySection';

const Homepage = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div>
                <HeroSection />
                <GallerySection />
                <MapSection />
                <FacilitySection />
                <CTASection />
            </div>
            <Footer />
        </div>
    );
};

export default Homepage;
