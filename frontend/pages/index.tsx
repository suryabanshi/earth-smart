import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-earth-600">🌍 Earth Smart</div>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-earth-600">
              Login
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-20">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Build. Connect. Learn. Grow.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Earth Smart is the all-in-one platform for creators, builders, and learners.
            Design projects, connect with communities, learn new skills, and access powerful tools.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-lg">
              Get Started Free
            </Link>
            <Link href="#features" className="btn-secondary text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-4xl font-bold">Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: '🛠️',
                title: 'Design & Build',
                desc: 'Collaborative workspace for creating projects and products',
              },
              {
                icon: '👥',
                title: 'Social Network',
                desc: 'Connect with builders, share ideas, and grow communities',
              },
              {
                icon: '📰',
                title: 'News & Insights',
                desc: 'Curated content and trending topics in your industry',
              },
              {
                icon: '📚',
                title: 'Learning Platform',
                desc: 'Structured courses and skill development programs',
              },
              {
                icon: '🔧',
                title: 'Tools Marketplace',
                desc: 'Integrations, APIs, and productivity tools',
              },
              {
                icon: '🌐',
                title: 'Extensible',
                desc: 'Build and share your own apps and extensions',
              },
            ].map((feature, i) => (
              <div key={i} className="card text-center">
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-earth-600 py-16 text-white">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to start building?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of creators and builders on Earth Smart
          </p>
          <Link href="/auth/register" className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-earth-600 hover:bg-gray-100">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container text-center text-gray-600">
          <p>© 2024 Earth Smart by Suman Suryabanshi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
