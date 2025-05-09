
'use client';

import React from 'react';
import { Clock, Heart, Users, Shield, Zap, Award, ArrowRight, TrendingUp } from 'lucide-react';

const Benefits = () => {
  return (
    <section id="benefits" className="section bg-gradient-to-br from-instacare-50 to-blue-50 py-20">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-medgreen-100 text-medgreen-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
            The Impact
          </span>
          <h2 className="mb-4">Why Use InstaCare?</h2>
          <p className="text-lg text-foreground/80">
            Our platform provides critical information when you need it most, potentially saving lives by reducing wait times.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Clock className="h-8 w-8 text-white" />,
              title: "Save Precious Time",
              description: "Find the fastest emergency care based on real-time wait predictions.",
              iconBg: "bg-gradient-to-br from-instacare-500 to-instacare-600",
              highlight: "Up to 47% time saved"
            },
            {
              icon: <Heart className="h-8 w-8 text-white" />,
              title: "Better Outcomes",
              description: "For critical conditions, faster treatment leads to improved recovery chances.",
              iconBg: "bg-gradient-to-br from-red-500 to-red-600",
              highlight: "Critical for stroke & heart attacks"
            },
            {
              icon: <Users className="h-8 w-8 text-white" />,
              title: "Reduce Overcrowding",
              description: "Help distribute patients more evenly across available emergency rooms.",
              iconBg: "bg-gradient-to-br from-medgreen-500 to-medgreen-600",
              highlight: "Balances hospital capacity"
            },
            {
              icon: <Shield className="h-8 w-8 text-white" />,
              title: "Peace of Mind",
              description: "Know what to expect before you arrive at the emergency room.",
              iconBg: "bg-gradient-to-br from-instacare-700 to-instacare-800",
              highlight: "Reduced anxiety"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 group hover:border-instacare-200 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              <div className={`${item.iconBg} p-6 flex items-center justify-between`}>
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium text-white ml-4">
                  {item.highlight}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center rounded-full px-4 py-1 bg-medgreen-100 text-medgreen-800 mb-6">
                <Heart className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Our Mission</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Using Underutilized Data to <span className="bg-gradient-to-br from-instacare-600 to-medgreen-500 bg-clip-text text-transparent">Potentially Save Lives</span>
              </h3>
              
              <p className="text-foreground/80 leading-relaxed mb-8">
                Hospital wait times are often publicly available but not easily accessible or understandable for patients.
                By aggregating this data and making it actionable, we help patients find faster care when it matters most.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="h-4 w-4 text-medgreen-600" />,
                    title: "Every Minute Matters",
                    description: "In critical emergencies, faster care directly correlates with better survival rates and reduced long-term complications."
                  },
                  {
                    icon: <Users className="h-4 w-4 text-medgreen-600" />,
                    title: "Balanced Healthcare",
                    description: "Better distribution of patients improves hospital efficiency and reduces strain on overcrowded facilities."
                  },
                  {
                    icon: <Award className="h-4 w-4 text-medgreen-600" />,
                    title: "Empowering Patients",
                    description: "Transparent information enables informed healthcare decisions in critical moments."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-medgreen-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{item.title}</h4>
                      <p className="text-foreground/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-instacare-600 to-instacare-800 text-white p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center rounded-full px-3 py-1 bg-white/20 backdrop-blur-sm text-white mb-6">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Real Impact</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-8">
                The Impact of ER Wait Times
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    value: "4.3",
                    unit: "hrs",
                    description: "Average ER wait time during peak periods"
                  },
                  {
                    value: "30",
                    unit: "%",
                    description: "Patients leave without being seen due to long waits"
                  },
                  {
                    value: "1.5",
                    unit: "x",
                    description: "Mortality risk increase with every hour of delay"
                  },
                  {
                    value: "87",
                    unit: "%",
                    description: "Prediction accuracy of InstaCare's algorithms"
                  }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-between h-full">
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.value} <span className="text-xl">{stat.unit}</span>
                    </div>
                    <div className="h-1 w-16 bg-white/30 mb-3"></div>
                    <p className="text-white/80">{stat.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-sm text-white/60 pt-4 border-t border-white/10">
                Source: Healthcare Access and Quality Index study, 2022
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
