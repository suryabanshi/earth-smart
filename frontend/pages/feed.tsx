import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Feed() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      })

      if (res.ok) {
        setNewPost('')
        fetchPosts()
      }
    } catch (err) {
      console.error('Failed to create post:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-earth-600">
            🌍 Earth Smart
          </Link>
          <div className="space-x-4">
            <Link href="/feed" className="text-earth-600 font-semibold">Feed</Link>
            <Link href="/learn" className="text-gray-600 hover:text-earth-600">Learn</Link>
            <Link href="/news" className="text-gray-600 hover:text-earth-600">News</Link>
            <Link href="/tools" className="text-gray-600 hover:text-earth-600">Tools</Link>
            <Link href="/hook" className="text-gray-600 hover:text-earth-600">Hook</Link>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                router.push('/')
              }}
              className="text-gray-600 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-8">
        <div className="mx-auto max-w-2xl">
          {/* New Post */}
          <div className="card mb-6">
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full min-h-24"
                required
              />
              <button type="submit" className="btn-primary">
                Post
              </button>
            </form>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500">No posts yet. Be the first to share!</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="card">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="text-2xl">👤</div>
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-800">{post.content}</p>
                  <div className="mt-4 flex gap-4 text-gray-600">
                    <button className="hover:text-earth-600">❤️ {post.likes || 0}</button>
                    <button className="hover:text-earth-600">💬 {post.comments || 0}</button>
                    <button className="hover:text-earth-600">🔄 Share</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
