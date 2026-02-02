import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Image */}
            <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-gray-100 order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
                alt="Fashionable model in neutral tones" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Right Content */}
            <div className="space-y-8 order-1 lg:order-2 lg:pl-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100">
                <Sparkles className="w-3 h-3 text-green-600" />
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Powered by Neural Styles</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-gray-900 max-w-4xl">
                Your Personal <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">AI Stylist</span> Awaits
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl px-4">
                Discover outfits curated uniquely for your body type and style preferences. High-end fashion meets machine learning to redefine your wardrobe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/stylist" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-green-300">
                  Get My AI Look
                </Link>
                <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all">
                  Explore Trends
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm text-gray-400">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Free Style Analysis</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Instant Matches</span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Style Quiz Section */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-8">
          <div className="bg-green-50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50" />
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl">
                ✨
              </div>
              <div className="space-y-1">
                 <h2 className="text-2xl font-bold text-gray-900">AI Style Quiz</h2>
                 <p className="text-gray-600">What’s your vibe today? Personalize your feed in 30 seconds.</p>
              </div>
            </div>
            
            <button className="relative z-10 whitespace-nowrap px-8 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-colors flex items-center gap-2">
               Start Quiz
               <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-12">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              <Link href="/shop" className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1">
                 View All <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {[
                 { name: "Oversized Blazer", price: 189.00, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800", cat: "Outerwear" },
                 { name: "Eco-Knit Sweater", price: 120.00, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800", cat: "Tops" },
                 { name: "Tailored Trousers", price: 145.00, img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800", cat: "Bottoms" },
                 { name: "Leather Boots", price: 210.00, img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800", cat: "Footwear" },
              ].map((item, i) => (
                 <Link href="/products/demo" key={i} className="group cursor-pointer block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
                       <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                       <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                       </button>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-700 transition-colors">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.cat}</p>
                    <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                 </Link>
              ))}
           </div>
        </section>

        {/* Collections Section */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-12 bg-white">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Curated Collections</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                 { title: "Sustainable Chic", img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800" },
                 { title: "Work From Anywhere", img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800" },
                 { title: "Date Night AI Picks", img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800" },
              ].map((collection, i) => (
                 <div key={i} className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer">
                    <img 
                       src={collection.img} 
                       alt={collection.title} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                       <h3 className="text-2xl font-bold text-white mb-4">{collection.title}</h3>
                       <span className="inline-flex items-center text-sm font-semibold text-white group-hover:text-green-300 transition-colors">
                          Shop Collection <ArrowRight className="ml-2 w-4 h-4" />
                       </span>
                    </div>
                 </div>
              ))}
           </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
