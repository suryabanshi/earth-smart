import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Tools() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/auth/login')
  }, [])

  const tools = [
    { id: 1, name: 'API Manager', description: 'Manage and monitor your APIs', category: 'Development' },
    { id: 2, name: 'Analytics Dashboard', description: 'Track usage and metrics', category: 'Analytics' },
    { id: 3, name: 'Collaboration Tool', description: 'Real-time team collaboration', category: 'Productivity' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-earth-600">🌍 Earth Smart</Link>
          <div className="space-x-4">
            <Link href="/feed" className="text-gray-600 hover:text-earth-600">Feed</Link>
            <Link href="/learn" className="text-gray-600 hover:text-earth-600">Learn</Link>
            <Link href="/news" className="text-gray-600 hover:text-earth-600">News</Link>
            <Link href="/tools" className="text-earth-600 font-semibold">Tools</Link>
            <Link href="/hook" className="text-gray-600 hover:text-earth-600">Hook</Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="mb-8 text-4xl font-bold">Tools Marketplace</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool.id} className="card hover:shadow-lg transition-shadow">
              <div className="mb-4 text-5xl">🔧</div>
              <h3 className="mb-2 text-lg font-semibold">{tool.name}</h3>
              <p className="mb-4 text-gray-600 text-sm">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{tool.category}</span>
                <button className="text-earth-600 font-semibold hover:text-earth-700">Install →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
