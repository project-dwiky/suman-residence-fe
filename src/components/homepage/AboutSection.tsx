"use client";
import React from 'react';
import { Button } from '@/components/ui/button';

const AboutSection = () => {
  return (
    <section className="py-6 md:py-16 px-4 md:px-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 text-center">Tentang Suman Residence</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* About Info */}
          <div className="bg-card rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-primary mb-4">Hunian Kos-kosan Eksklusif</h3>
            <p className="text-foreground/80 mb-6">
              Suman Residence adalah hunian kos-kosan eksklusif khusus perempuan yang terletak di kawasan
              strategis Lamgugob, Kota Banda Aceh. Dengan konsep "Cozy Living Space", kami menawarkan 
              kenyamanan dan keamanan untuk para penghuni.
            </p>
            
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-primary mb-3">Kontak</h4>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Owner:</span> 082211040701
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Admin:</span> 081265945003
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Email:</span> Sumanresidence338@gmail.com
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-xl font-semibold text-primary mb-3">Social Media</h4>
                <div className="flex space-x-4">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Instagram:</span> @Suman_Residence
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">TikTok:</span> @Suman.Residence
                  </p>
                </div>
              </div>
            </div>
            
            <Button className="mt-6 bg-secondary text-white hover:bg-secondary/90">Hubungi via WhatsApp</Button>
          </div>
          
          {/* Map */}
          <div className="bg-card rounded-xl shadow-lg overflow-hidden h-[400px] md:h-auto">
            <div className="h-full w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.022404364506!2d95.3639!3d5.5777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzQnNDAuMCJOIDk1wrAyMScyNS45IkU!5e0!3m2!1sen!2sid!4v1624961735854!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Suman Residence"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-10 bg-card rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-primary mb-4">Lokasi Strategis</h3>
          <p className="text-foreground/80">
            Terletak di Jl. Apel, Lamgugob, Kec. Syiah Kuala, Kota Banda Aceh. 
            Lokasi ini sangat strategis, dekat dengan pusat kota, kampus, dan berbagai fasilitas publik.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="font-semibold">5 menit</p>
              <p className="text-sm text-muted-foreground">ke Universitas Syiah Kuala</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="font-semibold">10 menit</p>
              <p className="text-sm text-muted-foreground">ke Pusat Perbelanjaan</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="font-semibold">15 menit</p>
              <p className="text-sm text-muted-foreground">ke Pantai Ulee Lheue</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
