"use client"

import { Check } from 'lucide-react';
import React from 'react';



const PricingCard = ({ 
  title, 
  description, 
  price, 
  price2,
  period, 
  period2, 
  features, 
  buttonText, 
  buttonStyle,
  isPopular = false,
  isPrimary = false
}) => {
  return (
    <div className={`
      relative bg-white rounded-2xl shadow-lg 
      ${isPopular ? 'border-2 border-[#d4b038] bg-gradient-to-b from-[rgba(212,176,56,0.1)] to-white shadow-2xl scale-105 z-10' : 'border border-gray-200'}
      ${isPrimary ? 'transform transition-transform hover:scale-105' : ''}
      flex flex-col h-full
    `}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#d4b038] text-[#02331e] px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
          Most Popular
        </div>
      )}
      
      <div className="p-8 flex flex-col flex-grow">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-[#02331e] mb-2">
            {title}
          </h3>
          <p className="text-sm text-[#4a5565]">
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-end justify-center gap-1">
            <span className="text-5xl font-bold text-[#02331e]">{price}</span>
            {period && <span className="text-base text-[#4a5565] mb-2">{period}</span>}
            {price2 && <span className="text-base text-[#4a5565] mb-2"> + {price2}</span> }

            {period2 && <span className="text-base text-[#4a5565] mb-2">{period2}</span>}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <Check className="text-[#D4B038]" size={18} />
              </div>
              <span className="text-sm text-[#364153]">{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sageeai@sageeai.com" className={`
          w-full py-3 px-8 rounded-full font-semibold text-base text-center
          transition-all duration-200
          ${buttonStyle === 'primary' 
            ? 'bg-[#02331e] text-white shadow-lg hover:bg-[#02331e]/90' 
            : 'bg-[#f3f4f6] text-[#02331e] border border-gray-200 hover:bg-gray-200'
          }
        `}>
          {buttonText}
        </a>
      </div>
    </div>
  );
};

const PricingPackages = () => {
  const pricingPlans = [
    {
      title: 'Starter',
      description: 'Perfect for Beauty & Wellness brands',
      price: '$229',
      period: '/month',
      price2:'$0.50',
      period2:'/scan',
      features: [
        'Embed Ai skin analysis on websites',
        'Personalized product recommendations',
        'Reduces return rates by 40%',
        'increase conversion 2-3x',
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'secondary'
    },
    {
      title: 'Professional',
      description: 'Perfect for Retailers & E-commerce',
      price: '$999',
      period: '/month',
      features: [
        'white label Ai assistant',
        'Cross sell optimisation',
        'customer data insight',
        'branded experience',
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'primary',
      isPopular: true,
      isPrimary: true
    },
    {
      title: 'Enterprise',
      description: 'Tailored solutions for large-scale operations',
      price: 'Custom',
      period: null,
      features: [
        'Custom Ai integration',
        'Multi brand support',
        'advanced analytics',
        'Unlimited team members',
        'dedicated support'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'secondary'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-normal text-[#02331e] mb-4">
            Simple, <span className="text-[#d4b038]">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-[#4a5565]">
            Choose the plan that fits your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              price2={plan.price2}
              period={plan.period}
              period2={plan.period2}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonStyle={plan.buttonStyle}
              isPopular={plan.isPopular}
              isPrimary={plan.isPrimary}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPackages;