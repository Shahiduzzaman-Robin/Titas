'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Slider.css';

const slides = [
  {
    id: 1,
    title: 'ইফতার ও দোয়া মাহফিল ২০২৬',
    description: 'একসাথে ইফতার, একসাথে দোয়া—ভ্রাতৃত্বের বন্ধন আরও দৃঢ় করি',
    image: '/images/slider-1.JPG',
  },
  {
    id: 2,
    title: 'নবীনবরণ ও সাংস্কৃতিক সন্ধ্যা ২০২৪',
    description: 'নতুনদের স্বাগত আর সংস্কৃতির রঙে রাঙানো এক সন্ধ্যা',
    image: '/images/slider-2.JPG',
  },
  {
    id: 3,
    title: 'ফ্রুট ফেস্ট ১.০',
    description: 'স্বাস্থ্যকর খাবার, আনন্দমুখর আয়োজন',
    image: '/images/slider-3.JPG',
  },
  {
    id: 4,
    title: 'কার্যকরী কমিটি নির্বাচন',
    description: 'নেতৃত্ব গঠনে স্বচ্ছ ও গণতান্ত্রিক প্রক্রিয়া',
    image: '/images/slider-4.JPG',
  },
  {
    id: 5,
    title: 'সাধারণ সভা',
    description: 'মতামত, পরিকল্পনা ও ভবিষ্যৎ দিকনির্দেশনা',
    image: '/images/slider-5.JPG',
  },
  {
    id: 6,
    title: 'কার্যকরী কমিটি নির্বাচন ২০২৬',
    description: 'নতুন নেতৃত্ব, নতুন সম্ভাবনার সূচনা',
    image: '/images/slider-6.JPG',
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Extend slides for infinite loop: [Last, 1, 2, 3, 4, 5, 6, First]
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  const nextSlide = useCallback(() => {
    if (currentIndex >= extendedSlides.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, extendedSlides.length]);

  const prevSlide = () => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      // Jumped to Last Slide Clone (at index 0) -> Jump to real Last Slide
      setIsTransitioning(false);
      setCurrentIndex(slides.length);
    } else if (currentIndex === extendedSlides.length - 1) {
      // Jumped to First Slide Clone (at index length-1) -> Jump to real First Slide
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused]);

  // Calculate the active index for indicators (0 to 5)
  const activeIndicator = 
    currentIndex === 0 ? slides.length - 1 : 
    currentIndex === extendedSlides.length - 1 ? 0 : 
    currentIndex - 1;

  return (
    <div 
      className="slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="slider-wrapper"
        onTransitionEnd={handleTransitionEnd}
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
        }}
      >
        {extendedSlides.map((slide, index) => (
          <div 
            key={`${slide.id}-${index}`} 
            className={`slide ${index === currentIndex ? 'active' : ''}`}
          >
            <Image 
              src={slide.image} 
              alt={slide.title} 
              className="slide-image"
              fill
              priority={index === 1}
              quality={85}
              sizes="100vw"
            />
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-nav">
        <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft />
        </button>
        <button className="nav-btn next" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight />
        </button>
      </div>

      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === activeIndicator ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
