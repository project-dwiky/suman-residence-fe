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
        <div className="min-h-screen overflow-x-hidden">
            <Navbar />
            <div className="pt-8 md:pt-12">
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
