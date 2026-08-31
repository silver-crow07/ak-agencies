'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Phone, Mail, Lock } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { state } = useCart();
  const [step, setStep] = useState<'contact' | 'shipping' | 'payment'>('contact');

  if (state.items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-lg text-text mb-4">Your cart is empty</p>
            <Link href="/shop" className="text-sm font-medium text-gold hover:text-primary transition-colors">
              Start Shopping →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <span className="text-text">Checkout</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2">
              {/* Step tabs */}
              <div className="flex items-center gap-4 mb-8">
                {[
                  { id: 'contact' as const, label: 'Contact', icon: User },
                  { id: 'shipping' as const, label: 'Shipping', icon: Truck },
                  { id: 'payment' as const, label: 'Payment', icon: CreditCard },
                ].map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                      step === s.id ? 'text-primary' : 'text-text-light'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                      step === s.id ? 'bg-primary text-white' : 'bg-cream text-text-light'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Contact */}
              {step === 'contact' && (
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                  <h2 className="font-serif text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <User size={20} className="text-gold" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Full Name *</label>
                      <input type="text" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="Enter your full name" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Phone *</label>
                        <input type="tel" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Email</label>
                        <input type="email" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="your@email.com" />
                      </div>
                    </div>
                    <button onClick={() => setStep('shipping')} className="w-full py-3 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors mt-4">
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* Shipping */}
              {step === 'shipping' && (
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                  <h2 className="font-serif text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-gold" />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Address *</label>
                      <input type="text" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="Street address" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">City *</label>
                        <input type="text" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="City" />
                      </div>
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">State *</label>
                        <input type="text" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="State" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">PIN Code *</label>
                        <input type="text" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="PIN code" />
                      </div>
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Phone *</label>
                        <input type="tel" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => setStep('contact')} className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-text-light border border-border rounded hover:border-primary hover:text-primary transition-colors">
                        <ArrowLeft size={14} />
                        Back
                      </button>
                      <button onClick={() => setStep('payment')} className="flex-1 py-3 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors">
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              {step === 'payment' && (
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                  <h2 className="font-serif text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-gold" />
                    Payment Method
                  </h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
                      { id: 'upi', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm' },
                      { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-gold transition-colors">
                        <input type="radio" name="payment" className="w-4 h-4 accent-gold" defaultChecked={method.id === 'cod'} />
                        <div>
                          <p className="text-sm font-medium text-text">{method.label}</p>
                          <p className="text-xs text-text-light">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-light mb-6">
                    <Lock size={12} />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep('shipping')} className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-text-light border border-border rounded hover:border-primary hover:text-primary transition-colors">
                      <ArrowLeft size={14} />
                      Back
                    </button>
                    <button className="flex-1 py-3 bg-gold text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-light-gold transition-colors">
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="font-serif text-lg font-bold text-primary mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-cream overflow-hidden shrink-0 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-cream to-light-gold/20" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text truncate">{item.product.name}</p>
                        <p className="text-[10px] text-text-light">{item.selectedColor} {item.selectedSize && `· ${item.selectedSize}`}</p>
                      </div>
                      <p className="text-xs font-bold text-text shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Subtotal</span>
                    <span className="text-text">{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Shipping</span>
                    <span className="text-gold font-medium">{state.total >= 999 ? 'Free' : formatPrice(99)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-sm font-bold text-text">Total</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(state.total + (state.total >= 999 ? 0 : 99))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
