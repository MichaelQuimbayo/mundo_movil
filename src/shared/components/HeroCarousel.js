import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const HeroCarousel = ({ slides, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (autoPlayInterval) {
      const timer = setTimeout(goToNext, autoPlayInterval);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlayInterval]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[600px]  bg-cover bg-center flex justify-center overflow-hidden">
      {/* Slide Content */}
      <div className="w-full h-full relative">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out" style={{ backgroundImage: `url(${currentSlide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        {/*<div className="absolute inset-0 bg-black opacity-50"></div>*/}

            {/* 3. EL EFECTO MERCADO LIBRE: Degradado que difumina el borde inferior */}
            {/*
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-100 via-white/80 to-transparent pointer-events-none"></div>
            */}
            {/* Este bloque de arriba pinta un desvanecido gris sobre la base de tu foto para que se fusione con la web */}

        </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-5 z-20">
        <button onClick={goToPrevious} className="p-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-800 transition-colors">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-5 z-20">
        <button onClick={goToNext} className="p-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-800 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-110' : 'bg-white/50'}`}
            aria-label={`Ir a la diapositiva ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
