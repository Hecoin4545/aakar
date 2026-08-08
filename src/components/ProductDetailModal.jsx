import React, { useState } from 'react';
import { X, MessageCircle, Shield, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { createProductInquiryWhatsAppUrl } from '../utils/whatsapp';

const ProductDetailModal = ({ product, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80'
  ];

  const variants = product.variants || [];
  const selectedVariant = variants[selectedVariantIndex] || null;
  const sizes = selectedVariant?.sizes || [];
  const selectedSize = sizes[selectedSizeIndex] || null;

  // Calculate final dynamic price with size adjustment
  const sizeAdj = selectedSize ? selectedSize.priceAdjustment || 0 : 0;
  const basePriceNum = Number(product.basePrice || 0);
  const finalPriceNum = basePriceNum + sizeAdj;
  const finalPriceFormatted = '₹' + finalPriceNum.toLocaleString('en-IN');

  const handleVariantSelect = (idx) => {
    setSelectedVariantIndex(idx);
    setSelectedSizeIndex(0);
    if (variants[idx]?.imageIndex !== undefined && images[variants[idx].imageIndex]) {
      setActiveImageIndex(variants[idx].imageIndex);
    }
  };

  const whatsappUrl = createProductInquiryWhatsAppUrl({
    product: { ...product, priceFormatted: finalPriceFormatted },
    selectedVariant,
    selectedSize
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2C2015]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      {/* Modal Container */}
      <div 
        className="relative bg-[#F7F3E9] w-full max-w-4xl rounded-xl shadow-2xl border border-[#E3DDCE] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur border border-[#E3DDCE] text-[#3A2A1C] hover:bg-[#3A2A1C] hover:text-white transition-colors flex items-center justify-center"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="md:col-span-6 bg-[#EFEAE0] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E3DDCE]">
            <div>
              {/* Main Image View */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E3DDCE] bg-white shadow-sm mb-4">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#2C2015] text-[#C9A45C] text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1 rounded">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx ? 'border-[#B4863A] scale-105 shadow-md' : 'border-[#E3DDCE] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Atelier Guarantee Box */}
            <div className="mt-6 pt-4 border-t border-[#E3DDCE] space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#3A2A1C] font-medium">
                <Shield className="w-4 h-4 text-[#B4863A]" />
                <span>100% Solid Seasoned Hardwood Joinery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#3A2A1C] font-medium">
                <Sparkles className="w-4 h-4 text-[#B4863A]" />
                <span>Custom Timber Stains & Custom Sizing Available</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Specifications & WhatsApp Enquire */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-white flex flex-col justify-between">
            <div>
              
              {/* Category Breadcrumb */}
              <div className="font-sans text-[11px] font-semibold tracking-widest text-[#B4863A] uppercase mb-1">
                Products / {product.category}
              </div>

              {/* Product Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1C] mb-2 leading-tight">
                {product.title}
              </h2>

              {/* Price & Stock */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E3DDCE]">
                <div>
                  <span className="text-xs text-[#8A8478] font-sans block">Starting Price</span>
                  <span className="font-sans text-2xl font-bold text-[#3A2A1C]">
                    {finalPriceFormatted}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#EFEAE0] text-xs font-semibold text-[#5B7A4F]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {product.stockStatus || 'In Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="font-sans text-sm text-[#4A5A78] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Finish / Variant Swatches */}
              {variants.length > 0 && (
                <div className="mb-5">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#3A2A1C] mb-2">
                    Select Timber Finish / Upholstery:
                  </label>
                  <div className="flex items-center gap-3">
                    {variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleVariantSelect(idx)}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
                          selectedVariantIndex === idx 
                            ? 'border-[#B4863A] bg-[#F7F3E9] text-[#3A2A1C] font-medium shadow-sm' 
                            : 'border-[#E3DDCE] hover:border-[#B4863A] text-[#4A5A78]'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-black/20" 
                          style={{ backgroundColor: variant.hexColor || '#B4863A' }} 
                        />
                        <span className="text-xs font-sans">{variant.colorName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#3A2A1C] mb-2">
                    Dimensions / Configuration:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sizes.map((sz, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`text-left p-2.5 rounded border text-xs font-sans transition-all ${
                          selectedSizeIndex === idx 
                            ? 'border-[#B4863A] bg-[#3A2A1C] text-white font-medium' 
                            : 'border-[#E3DDCE] hover:border-[#B4863A] text-[#4A5A78] bg-[#F7F3E9]/50'
                        }`}
                      >
                        <div className="font-semibold">{sz.name}</div>
                        {sz.priceAdjustment !== 0 && (
                          <div className="text-[10px] opacity-80">
                            {sz.priceAdjustment > 0 ? `+₹${sz.priceAdjustment.toLocaleString('en-IN')}` : `-₹${Math.abs(sz.priceAdjustment).toLocaleString('en-IN')}`}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Table */}
              <div className="bg-[#F7F3E9] rounded-lg p-4 border border-[#E3DDCE] space-y-2 mb-6">
                <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#B4863A]">
                  Specification Sheet
                </h4>
                <div className="grid grid-cols-1 gap-1.5 text-xs font-sans pt-1">
                  <div className="flex justify-between border-b border-[#E3DDCE]/60 pb-1">
                    <span className="text-[#8A8478]">Primary Material:</span>
                    <span className="font-medium text-[#3A2A1C]">{product.material}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3DDCE]/60 pb-1">
                    <span className="text-[#8A8478]">Dimensions:</span>
                    <span className="font-medium text-[#3A2A1C]">{product.dimensions}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3DDCE]/60 pb-1">
                    <span className="text-[#8A8478]">Finish Treatment:</span>
                    <span className="font-medium text-[#3A2A1C]">{product.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8478]">Warranty & Care:</span>
                    <span className="font-medium text-[#3A2A1C]">{product.warranty}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Section */}
            <div className="pt-4 border-t border-[#E3DDCE]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#5B7A4F] hover:bg-[#4a6440] text-white font-sans text-xs font-bold tracking-wider uppercase py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>Enquire via WhatsApp (Pre-filled Specs)</span>
              </a>
              <p className="font-sans text-[11px] text-[#8A8478] text-center mt-2">
                Connects directly with an atelier master craftsman for custom dimensions & lead time.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
