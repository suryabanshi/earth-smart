import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

export default function News() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/auth/login')
  }, [])

  const news = [
    { id: 1, title: 'New AI Tools Launch', author: 'Tech News Daily', category: 'AI', date: '2024-01-15' },
    { id: 2, title: 'Web Dev Trends 2024', author: 'Dev Weekly', category: 'Web', date: '2024-01-14' },
    { id: 3, title: 'Startup Funding Report', author: 'Business Insider', category: 'Business', date: '2024-01-13' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-earth-600">🌍 Earth Smart</Link>
          <div className="space-x-4">
            <Link href="/feed" className="text-gray-600 hover:text-earth-600">Feed</Link>
            <Link href="/learn" className="text-gray-600 hover:text-earth-600">Learn</Link>
            <Link href="/news" className="text-earth-600 font-semibold">News</Link>
            <Link href="/tools" className="text-gray-600 hover:text-earth-600">Tools</Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="mb-8 text-4xl font-bold">News & Insights</h1>

        <div className="max-w-2xl space-y-4">
          {news.map((item) => (
            <div key={item.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📰</div>
                <div className="flex-grow">
                  <h3 className="mb-2 text-xl font-semibold hover:text-earth-600">{item.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>By {item.author}</span>
                    <span>•</span>
                    <span className="bg-earth-100 text-earth-700 px-2 py-1 rounded text-xs">{item.category}</span>
                    <span>•</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
