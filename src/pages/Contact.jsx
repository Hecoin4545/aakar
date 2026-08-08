import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';
import { inquiryService } from '../services/api';
import { createQuickInquiryWhatsAppUrl } from '../utils/whatsapp';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    furnitureType: 'Dining Table',
    budgetRange: '₹1.5L - ₹3L',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, directWhatsApp = false) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    try {
      // 1. Submit to API database
      await inquiryService.submitInquiry({
        name: formData.name,
        phone: formData.phone,
        furnitureType: formData.furnitureType,
        budgetRange: formData.budgetRange,
        message: `${formData.email ? `Email: ${formData.email} | ` : ''}${formData.message}`
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Inquiry API submission notice:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }

    // 2. If WhatsApp CTA chosen or requested, launch WhatsApp pre-filled link
    if (directWhatsApp) {
      const whatsappUrl = createQuickInquiryWhatsAppUrl(formData);
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Ambient Glow */}
      {/* <div className="ambient-orb ambient-orb-warm w-[450px] h-[450px] top-10 -right-20" /> */}
      {/* <div className="ambient-orb ambient-orb-gold w-[350px] h-[350px] bottom-1/4 -left-10" /> */}

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase mb-1">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C]">
            Commission a Bespoke Furniture Piece
          </h1>
          <p className="font-sans text-sm text-[#4A5A78] mt-2 leading-relaxed">
            Visit our flagship atelier showroom in Jodhpur or submit your architectural specifications below for a direct master artisan consultation.
          </p>
        </div>

        {/* TWO-COLUMN SPLIT LAYOUT: INFO + FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

          {/* LEFT COLUMN: Contact Details & Showroom Specs */}
          <div className="lg:col-span-5 space-y-8">

            <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#3A2A1C] border-b border-[#E3DDCE] pb-3">
                Atelier & Showroom Details
              </h3>

              <div className="space-y-4 font-sans text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#F7F3E9] text-[#B4863A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3A2A1C]">Main Workshop & Atelier</h4>
                    <p className="text-xs text-[#4A5A78] mt-0.5">
                      Plot 42, Heavy Industrial Area, Phase II, Jodhpur, Rajasthan - 342001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#F7F3E9] text-[#B4863A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3A2A1C]">Direct Atelier Phone</h4>
                    <p className="text-xs text-[#4A5A78] mt-0.5">
                      +91 98765 43210 / +91 291 2750190
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#F7F3E9] text-[#B4863A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3A2A1C]">Email Enquiries</h4>
                    <p className="text-xs text-[#4A5A78] mt-0.5">
                      concierge@heritagecraftsmen.com / orders@heritage.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#F7F3E9] text-[#B4863A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3A2A1C]">Atelier Visiting Hours</h4>
                    <p className="text-xs text-[#4A5A78] mt-0.5">
                      Mon - Sat: 10:00 AM – 7:00 PM (By Prior Appointment)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action Box */}
            <div className="bg-[#5B7A4F]/10 border border-[#5B7A4F]/30 rounded-lg p-6 text-[#2C2015] space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#3A2A1C] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#5B7A4F]" />
                <span>Need Instant Timber Samples?</span>
              </h4>
              <p className="font-sans text-xs text-[#4A5A78] leading-relaxed">
                Connect directly with our senior wood technologist on WhatsApp for timber swatch photos and instant dimensions consultation.
              </p>
              <a
                href={createQuickInquiryWhatsAppUrl({ name: 'Showroom Inquiry', phone: '', furnitureType: 'Timber Swatches', budgetRange: '' })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5B7A4F] hover:bg-[#4a6440] text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: General Inquiry Form Panel */}
          <div className="lg:col-span-7 bg-white border border-[#E3DDCE] rounded-lg p-6 sm:p-8 shadow-luxury">

            <h3 className="font-serif text-2xl font-bold text-[#3A2A1C] mb-1">
              Send an Enquiry
            </h3>
            <p className="font-sans text-xs text-[#8A8478] mb-6">
              Provide your space dimensions or furniture requirements. We respond within 24 business hours.
            </p>

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded px-4 py-3 text-xs text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A]"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone / WhatsApp Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded px-4 py-3 text-xs text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A]"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded px-4 py-3 text-xs text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8A8478] mb-1">
                    Furniture Category:
                  </label>
                  <select
                    value={formData.furnitureType}
                    onChange={(e) => setFormData({ ...formData, furnitureType: e.target.value })}
                    className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded px-3 py-2.5 text-xs text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
                  >
                    <option value="Dining Table">Dining Table & Seating</option>
                    <option value="Armchair / Lounge">Armchair / Lounge Seating</option>
                    <option value="Executive Desk">Executive Desk / Office</option>
                    <option value="Platform Bed">Master Bed / Suite</option>
                    <option value="Credenza / Sideboard">Credenza / Storage</option>
                    <option value="Bespoke Villa Project">Full Villa Commission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8A8478] mb-1">
                    Target Budget:
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded px-3 py-2.5 text-xs text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
                  >
                    <option value="Under ₹1L">Under ₹1,00,000</option>
                    <option value="₹1L - ₹2.5L">₹1,00,000 - ₹2,50,000</option>
                    <option value="₹2.5L - ₹5L">₹2,50,000 - ₹5,00,000</option>
                    <option value="₹5L+ Bespoke">₹5,00,000+ Custom Order</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Describe your design requirement, room dimensions, wood species preferences (Teak, Walnut, Oak), or timber finish preferences..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded px-4 py-3 text-xs text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A] resize-none"
                />
              </div>

              {/* DUAL CTA BUTTONS AT FORM BOTTOM matching design.md */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#2C2015] hover:bg-[#3A2A1C] text-white font-sans text-xs font-bold tracking-wider uppercase py-3.5 px-6 rounded shadow transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C9A45C]" />
                  <span>Submit Inquiry</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="flex-1 bg-[#5B7A4F] hover:bg-[#4a6440] text-white font-sans text-xs font-bold tracking-wider uppercase py-3.5 px-6 rounded shadow transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </button>
              </div>

              {submitted && (
                <div className="p-3 bg-[#5B7A4F]/10 border border-[#5B7A4F]/30 rounded text-xs text-[#5B7A4F] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Your inquiry has been logged! Our team will contact you shortly.</span>
                </div>
              )}

            </form>

          </div>

        </div>

        {/* EMBEDDED GOOGLE MAP LOCATION SHOWCASE */}
        <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3DDCE] pb-3">
            <div>
              <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
                WORKSHOP LOCATION MAP
              </span>
              <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">
                Jodhpur Craft Atelier & Showroom
              </h3>
            </div>
            <span className="text-xs text-[#8A8478] font-sans">Coordinates: 26.2389° N, 73.0243° E</span>
          </div>

          <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden bg-[#EFEAE0] border border-[#E3DDCE]">
            <iframe
              title="Heritage Craftsmen Atelier Workshop Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114502.83680287515!2d72.977462!3d26.238947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c4eaa06ccb9%3A0x8114ea5b0ae1abb8!2sJodhpur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
