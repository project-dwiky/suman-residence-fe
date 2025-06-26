import React from 'react';
import HeroSection from './HeroSection';
import FacilitySection from './FacilitySection';
import GallerySection from './GallerySection';
import MapSection from './MapSection';
import CTASection from './CTASection';
import Navbar from '../core/Navbar';
import Footer from '../core/Footer';

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
