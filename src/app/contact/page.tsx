'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.anim-item', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen w-full pt-32 px-6 md:px-12 pb-24 flex items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 bg-brand-card border border-brand-border rounded-2xl p-8 md:p-12 shadow-2xl">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="anim-item text-4xl md:text-5xl font-bold font-sans text-white mb-4">
            Get in <span className="text-brand-red">Touch</span>
          </h1>
          <p className="anim-item text-gray-400 font-sans text-sm leading-relaxed mb-10">
            Open for freelance opportunities, full-time roles, or general inquiries. Drop a message below and let's connect!
          </p>

          <div className="anim-item space-y-6 font-sans text-sm font-medium">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-brand-red"></span>
              <a href="mailto:andhikakarunia79@gmail.com" className="text-gray-300 hover:text-brand-red transition-colors">andhikakarunia79@gmail.com</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-brand-red"></span>
              <a href="https://www.linkedin.com/in/andhika-karunia-545166292" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-brand-red transition-colors">LinkedIn: /in/andhika-karunia</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-brand-red"></span>
              <a href="https://github.com/Tryton47" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-brand-red transition-colors">GitHub: @Tryton47</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-brand-red"></span>
              <a href="https://www.instagram.com/andhka_rzq" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-brand-red transition-colors">Instagram: @andhka_rzq</a>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="anim-item flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-gray-400">Name</label>
              <input type="text" className="w-full bg-brand-dark border border-brand-border rounded-lg p-4 font-sans text-sm text-white focus:outline-none focus:border-brand-red transition-colors shadow-inner" placeholder="Enter your name" />
            </div>
            <div className="anim-item flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-gray-400">Email</label>
              <input type="email" className="w-full bg-brand-dark border border-brand-border rounded-lg p-4 font-sans text-sm text-white focus:outline-none focus:border-brand-red transition-colors shadow-inner" placeholder="Enter your email" />
            </div>
            <div className="anim-item flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-gray-400">Message</label>
              <textarea rows={4} className="w-full bg-brand-dark border border-brand-border rounded-lg p-4 font-sans text-sm text-white focus:outline-none focus:border-brand-red transition-colors resize-none shadow-inner" placeholder="Write your message here..."></textarea>
            </div>
            <button className="anim-item mt-4 w-full bg-brand-red text-white font-bold font-sans text-sm py-4 rounded-lg hover:bg-red-600 transition-colors">
              Send Message
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
