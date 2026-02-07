import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2, Wand2, ShoppingBag, Layers, Zap } from 'lucide-react';
import TrendingSection from '@/components/TrendingSection';
import AnimateOnScroll from '@/components/AnimateOnScroll';

// Revalidate every 60 seconds (ISR) instead of force-dynamic
export const revalidate = 60;

interface ICollection {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description?: string;
  featured?: boolean;
}

async function getCollections() {
  try {
    const res = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/collections?featured=true`, {
      next: { revalidate: 60 } // Cache for 60 seconds with ISR
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch collections');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch collections', error);
    return [];
  }
}

export default async function Home() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />
      
      <main>
        {/* ===== Hero Section ===== */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-10 md:py-14 lg:py-12 xl:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-10 xl:gap-14 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
                <Sparkles className="w-3 h-3 text-green-600" />
                <span className="text-[11px] font-semibold text-green-700 uppercase tracking-wide">Powered by Google Gemini AI</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-[4.25rem] font-bold leading-[1.1] tracking-tight text-gray-900">
                Your Personal{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 italic">AI Stylist</span>
                <br className="hidden sm:block" /> Awaits
              </h1>
              
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg">
                Discover outfits curated uniquely for your body type and style preferences. AI-powered fashion meets your wardrobe to create the perfect look for every occasion.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/stylist" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30">
                  Try AI Stylist Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/shop" className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all">
                  View Lookbook
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Free Style Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Instant AI Matching</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative aspect-[3/4] lg:aspect-[4/5] xl:aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-2xl shadow-gray-900/10">
                <Image 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
                  alt="Fashionable model in neutral tones" 
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Floating accent card */}
              <div className="hidden lg:flex absolute -bottom-5 -left-6 bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-100 px-5 py-4 items-center gap-3 z-10 animate-page-enter" style={{ animationDelay: '0.4s' }}>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">AI Confidence</p>
                  <p className="text-sm font-bold text-gray-900">98% Style Match</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== How It Works Section ===== */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-12 md:py-16 lg:py-12 xl:py-16">
          <AnimateOnScroll>
            <div className="text-center mb-8 lg:mb-8 xl:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base">Get personalized outfit recommendations in three simple steps, powered by advanced AI.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
            {[
              { icon: ShoppingBag, step: 'Step 1', title: 'Browse Products', desc: 'Explore our curated collection of fashion items across multiple categories and styles.' },
              { icon: Wand2, step: 'Step 2', title: 'AI Generates Outfits', desc: 'Our AI analyzes your preferences and the occasion to create perfectly matched outfit combinations.' },
              { icon: Layers, step: 'Step 3', title: 'Shop the Look', desc: 'Review your AI-styled outfit, add everything to cart in one click, and look your best.' },
            ].map((item) => (
              <AnimateOnScroll key={item.step}>
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-6 xl:p-8 text-center relative overflow-hidden group hover:shadow-lg hover:shadow-green-600/5 transition-all duration-300 border border-transparent hover:border-green-100 hover-lift">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 bg-green-100 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-5 border border-gray-100 group-hover:border-green-100 group-hover:shadow-green-100/50 transition-all">
                      <item.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-[10px] font-bold text-green-600 uppercase tracking-[0.15em] mb-2">{item.step}</div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* ===== AI Features Section ===== */}
        <AnimateOnScroll className="w-full px-4 sm:px-8 lg:px-12 py-6">
          <div className="bg-gray-950 rounded-[2rem] p-8 md:p-12 lg:p-10 xl:p-14 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-green-500/8 rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8 lg:mb-6 xl:mb-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-5">
                  <Sparkles className="w-3 h-3 text-green-400" />
                  <span className="text-[11px] font-semibold text-green-400 uppercase tracking-wide">AI-Powered Features</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  Smart Fashion,{' '}
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Tailored Just for You</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">Our AI engine uses Google Gemini to understand your style, body type, and occasion to recommend outfits that truly fit you.</p>
              </div>
              
              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 stagger-children">
                {[
                  { icon: Wand2, title: 'Occasion-Based Styling', desc: 'Get outfit suggestions for Casual, Office, Party, or Street occasions.' },
                  { icon: Zap, title: 'Instant Recommendations', desc: 'AI generates complete outfit combinations in seconds, not hours.' },
                  { icon: Layers, title: 'Complete Outfits', desc: 'Every recommendation includes coordinated items from head to toe.' },
                  { icon: ShoppingBag, title: 'One-Click Shopping', desc: 'Add entire AI-curated outfits to your cart with a single click.' },
                ].map((feature) => (
                  <AnimateOnScroll key={feature.title}>
                    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 lg:p-6 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
                      <feature.icon className="w-7 h-7 text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-white font-semibold text-sm mb-1.5">{feature.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* ===== Trending Now Section ===== */}
        <TrendingSection />

        {/* ===== Shop by Style Section ===== */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-12 md:py-16 lg:py-12 xl:py-16 bg-white">
          <AnimateOnScroll>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 lg:mb-6 xl:mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by Style</h2>
              <p className="text-gray-400 text-sm mt-1.5">Browse our collections to find your preferred vibe.</p>
            </div>
            <Link href="/collections" className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1 flex-shrink-0">
              View All Collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          </AnimateOnScroll>
           
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {collections.length > 0 ? (
              collections.map((collection: ICollection) => (
                <Link key={collection._id} href={`/collections/${collection.slug}`} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-3">
                    <Image 
                      src={collection.imageUrl || 'https://via.placeholder.com/600x800'} 
                      alt={collection.name} 
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover arrow */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <ArrowRight className="w-3.5 h-3.5 text-gray-900" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{collection.name}</h3>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                <p>No style collections available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <AnimateOnScroll className="w-full px-4 sm:px-8 lg:px-12 py-10">
          <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 rounded-[2rem] px-8 py-12 md:px-12 md:py-16 lg:py-12 xl:py-16 text-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white/[0.03] rounded-full" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">Ready to Transform Your Wardrobe?</h2>
              <p className="text-green-50/90 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">Let our AI stylist analyze thousands of trends and create the perfect outfit for your next occasion. It takes just seconds.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/stylist" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-full hover:bg-green-50 transition-colors shadow-xl shadow-green-900/20">
                  Try AI Stylist Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-full border border-white/30 hover:bg-white/10 transition-colors">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

      </main>
      
      <Footer />
    </div>
  );
}
