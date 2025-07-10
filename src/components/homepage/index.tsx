import React from 'react';
import HeroSection from './sections/HeroSection';
import GallerySection from './sections/GallerySection';
import MapSection from './sections/MapSection';
import CTASection from './sections/CTASection';
import Navbar from '../core/Navbar';
import Footer from '../core/Footer';
import FacilitySection from './sections/FacilitySection';
import { getLanguageFromCookies } from '@/utils/language';

const Homepage = async () => {
    const language = await getLanguageFromCookies();

    return (
        <div className="min-h-screen">
            <Navbar />
            <div>
                <HeroSection language={language} />
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
