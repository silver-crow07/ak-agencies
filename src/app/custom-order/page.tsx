'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  MessageCircle,
  Layers,
  Palette,
  Ruler,
  Paintbrush,
  Camera,
  Hash,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const steps = [
  { id: 1, title: 'Product Type', icon: Layers },
  { id: 2, title: 'Fabric', icon: Palette },
  { id: 3, title: 'Color', icon: Paintbrush },
  { id: 4, title: 'Measurements', icon: Ruler },
  { id: 5, title: 'Design', icon: Paintbrush },
  { id: 6, title: 'Reference', icon: Camera },
  { id: 7, title: 'Quantity', icon: Hash },
  { id: 8, title: 'Details', icon: User },
  { id: 9, title: 'Submit', icon: Check },
];

const productTypes = ['Curtains', 'Sofa Cover', 'Bedsheet', 'Cushion Cover', 'Table Cover', 'Towel', 'Other'];
const fabrics = ['Cotton', 'Silk', 'Velvet', 'Linen', 'Polyester', 'Chiffon', 'Net', 'Other'];
const colors = ['Cream', 'White', 'Maroon', 'Gold', 'Navy Blue', 'Grey', 'Beige', 'Teal', 'Other'];
const designs = ['Floral', 'Geometric', 'Abstract', 'Plain Solid', 'Traditional', 'Modern', 'Custom (Describe Below)'];

export default function CustomOrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    productType: '',
    fabric: '',
    color: '',
    measurements: '',
    design: '',
    referenceImage: '',
    quantity: 1,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    notes: '',
  });

  const updateForm = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!formData.productType;
      case 2: return !!formData.fabric;
      case 3: return !!formData.color;
      case 4: return !!formData.measurements;
      case 5: return !!formData.design;
      case 6: return true;
      case 7: return formData.quantity > 0;
      case 8: return !!formData.customerName && !!formData.customerPhone;
      case 9: return true;
      default: return true;
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <span className="text-text">Custom Order</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center mb-8">
            <span className="text-xs tracking-[4px] text-gold uppercase font-medium">
              Custom Orders
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mt-2 mb-2">
              Create Your Custom Order
            </h1>
            <div className="line-divider w-16 mx-auto mt-4 mb-4" />
            <p className="text-sm text-text-light">
              Get your furnishing exactly the way you want it
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 md:p-12 text-center shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                Thank You!
              </h2>
              <p className="text-sm text-text-light mb-6 max-w-md mx-auto">
                Your custom order request has been submitted successfully. Our team will
                contact you shortly to discuss your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/919473831097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-green-600 text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={14} />
                  Chat on WhatsApp
                </a>
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 border-2 border-primary text-primary text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary hover:text-white transition-colors"
                >
                  Browse Products
                </a>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Step indicator */}
              <div className="flex items-center mb-8 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:justify-between">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center gap-2 px-2 ${
                        i < steps.length - 1 ? 'flex-shrink-0' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          currentStep > step.id
                            ? 'bg-gold text-white'
                            : currentStep === step.id
                            ? 'bg-primary text-white'
                            : 'bg-cream text-text-light'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check size={14} />
                        ) : (
                          step.id
                        )}
                      </div>
                      <span
                        className={`hidden md:inline text-xs font-medium ${
                          currentStep >= step.id ? 'text-text' : 'text-text-light'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-6 md:w-12 h-px mx-1 ${
                          currentStep > step.id ? 'bg-gold' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 1: Product Type */}
                    {currentStep === 1 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Select Product Type</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {productTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => updateForm('productType', type)}
                              className={`p-4 rounded-lg border text-sm font-medium transition-colors ${
                                formData.productType === type
                                  ? 'border-gold bg-gold/10 text-primary'
                                  : 'border-border text-text-light hover:border-gold'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Fabric */}
                    {currentStep === 2 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Choose Fabric</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {fabrics.map((fabric) => (
                            <button
                              key={fabric}
                              onClick={() => updateForm('fabric', fabric)}
                              className={`p-4 rounded-lg border text-sm font-medium transition-colors ${
                                formData.fabric === fabric
                                  ? 'border-gold bg-gold/10 text-primary'
                                  : 'border-border text-text-light hover:border-gold'
                              }`}
                            >
                              {fabric}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Color */}
                    {currentStep === 3 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Choose Color</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => updateForm('color', color)}
                              className={`p-4 rounded-lg border text-sm font-medium transition-colors ${
                                formData.color === color
                                  ? 'border-gold bg-gold/10 text-primary'
                                  : 'border-border text-text-light hover:border-gold'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Measurements */}
                    {currentStep === 4 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Enter Measurements</h2>
                        <p className="text-sm text-text-light mb-4">
                          Please provide the measurements in inches or centimeters.
                        </p>
                        <textarea
                          value={formData.measurements}
                          onChange={(e) => updateForm('measurements', e.target.value)}
                          placeholder="e.g., Width: 60 inches, Length: 90 inches&#10;Or describe your window/sofa dimensions..."
                          className="w-full h-32 px-4 py-3 bg-cream border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors resize-none"
                        />
                      </div>
                    )}

                    {/* Step 5: Design */}
                    {currentStep === 5 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Select Design / Pattern</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {designs.map((design) => (
                            <button
                              key={design}
                              onClick={() => updateForm('design', design)}
                              className={`p-4 rounded-lg border text-sm font-medium transition-colors ${
                                formData.design === design
                                  ? 'border-gold bg-gold/10 text-primary'
                                  : 'border-border text-text-light hover:border-gold'
                              }`}
                            >
                              {design}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 6: Reference Image */}
                    {currentStep === 6 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Upload Reference Image</h2>
                        <p className="text-sm text-text-light mb-4">
                          If you have a reference image of the design you want, please share it here.
                        </p>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <Upload size={32} className="text-text-light mx-auto mb-3" />
                          <p className="text-sm text-text-light mb-2">
                            Drag and drop an image, or click to browse
                          </p>
                          <p className="text-xs text-text-light/60">
                            JPG, PNG up to 5MB
                          </p>
                          <input
                            type="text"
                            value={formData.referenceImage}
                            onChange={(e) => updateForm('referenceImage', e.target.value)}
                            placeholder="Or paste an image URL..."
                            className="w-full max-w-sm mx-auto mt-4 px-4 py-2 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 7: Quantity */}
                    {currentStep === 7 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Select Quantity</h2>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => updateForm('quantity', Math.max(1, formData.quantity - 1))}
                            className="w-12 h-12 rounded border border-border flex items-center justify-center text-text-light hover:border-primary hover:text-primary transition-colors"
                          >
                            <span className="text-lg">−</span>
                          </button>
                          <span className="text-2xl font-bold text-text w-12 text-center">
                            {formData.quantity}
                          </span>
                          <button
                            onClick={() => updateForm('quantity', formData.quantity + 1)}
                            className="w-12 h-12 rounded border border-border flex items-center justify-center text-text-light hover:border-primary hover:text-primary transition-colors"
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 8: Customer Details */}
                    {currentStep === 8 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Your Details</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={formData.customerName}
                              onChange={(e) => updateForm('customerName', e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={formData.customerPhone}
                              onChange={(e) => updateForm('customerPhone', e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.customerEmail}
                              onChange={(e) => updateForm('customerEmail', e.target.value)}
                              placeholder="your@email.com"
                              className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">
                              Delivery Address
                            </label>
                            <textarea
                              value={formData.customerAddress}
                              onChange={(e) => updateForm('customerAddress', e.target.value)}
                              placeholder="Enter your delivery address"
                              className="w-full h-24 px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">
                              Additional Notes
                            </label>
                            <textarea
                              value={formData.notes}
                              onChange={(e) => updateForm('notes', e.target.value)}
                              placeholder="Any special requirements or notes..."
                              className="w-full h-24 px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 9: Review & Submit */}
                    {currentStep === 9 && (
                      <div>
                        <h2 className="font-serif text-xl font-bold text-primary mb-4">Review Your Order</h2>
                        <div className="space-y-3 bg-cream rounded-lg p-4 mb-4">
                          {[
                            { label: 'Product Type', value: formData.productType },
                            { label: 'Fabric', value: formData.fabric },
                            { label: 'Color', value: formData.color },
                            { label: 'Measurements', value: formData.measurements },
                            { label: 'Design', value: formData.design },
                            { label: 'Quantity', value: String(formData.quantity) },
                            { label: 'Name', value: formData.customerName },
                            { label: 'Phone', value: formData.customerPhone },
                            { label: 'Email', value: formData.customerEmail },
                          ].filter(item => item.value).map((item) => (
                            <div key={item.label} className="flex justify-between text-sm">
                              <span className="text-text-light">{item.label}</span>
                              <span className="font-medium text-text">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded transition-colors ${
                      currentStep === 1
                        ? 'text-text-light/40 cursor-not-allowed'
                        : 'text-text-light hover:text-primary'
                    }`}
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  {currentStep < 9 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!canProceed()}
                      className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded transition-colors ${
                        canProceed()
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-border text-text-light cursor-not-allowed'
                      }`}
                    >
                      Next
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-gold text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded hover:bg-light-gold transition-colors"
                    >
                      <Check size={14} />
                      Submit Order
                    </button>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="text-center mt-6">
                <a
                  href="https://wa.me/919473831097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-gold hover:text-primary transition-colors"
                >
                  <MessageCircle size={14} />
                  Prefer to chat? Message us on WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
