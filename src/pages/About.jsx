import { ArrowRight, Heart, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const values = [
  {
    icon: Sparkles,
    title: 'Style for Everyone',
    description: 'Explore trend-inspired collections and find pieces that feel like you.',
  },
  {
    icon: ShieldCheck,
    title: 'Shopping You Can Trust',
    description: 'Enjoy a simple, clear shopping experience from browsing to checkout.',
  },
  {
    icon: Truck,
    title: 'Convenient Delivery',
    description: 'Shop your favourites online and have your orders delivered to your doorstep.',
  },
  {
    icon: Heart,
    title: 'Made for Your Wishlist',
    description: 'Save the products you love and come back to them whenever you are ready.',
  },
]

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
                <Sparkles size={16} /> Our story
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your style.
                <span className="block text-blue-600">Your generation.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                Welcome to GenZ Trendz — a place to discover trend-inspired fashion, find your next favourite piece, and express your style with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Explore products <ArrowRight size={18} />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Back to home
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-4 rounded-3xl bg-blue-200/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-2 shadow-xl shadow-blue-100/60">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
                  alt="Friends browsing fashion together"
                  className="h-72 w-full rounded-xl object-cover sm:h-96"
                />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">GenZ Trendz</p>
                  <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">Find the look that feels like you.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Who we are</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                Fashion should feel like <span className="text-blue-600">you.</span>
              </h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-gray-600 sm:text-lg">
              <p>
                At GenZ Trendz, we believe personal style is a way to show the world who you are. It can be minimal, bold, classic, or completely your own.
              </p>
              <p>
                Our goal is to make discovering products online straightforward and enjoyable, with collections that help you explore your taste at your own pace.
              </p>
              <p>
                Whether you are looking for an everyday essential or something new for your wardrobe, GenZ Trendz is here to make your shopping journey easy.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Why GenZ Trendz</p>
              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">A better way to find your style.</h2>
              <p className="mt-4 leading-7 text-gray-600">
                Thoughtful features and a simple shopping experience, designed around what matters to you.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-blue-600 px-6 py-12 text-center text-white shadow-lg shadow-blue-200 sm:px-12 sm:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <PackageCheck size={25} />
            </div>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold sm:text-4xl">Ready to discover your next favourite?</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
              Browse the latest collections and find pieces that fit your style.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Shop now <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
