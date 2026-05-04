import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Learn() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/auth/login')
  }, [])

  const courses = [
    { id: 1, title: 'Web Development Basics', instructor: 'John Doe', level: 'Beginner' },
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', level: 'Intermediate' },
    { id: 3, title: 'Full Stack Development', instructor: 'Mike Wilson', level: 'Advanced' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-earth-600">🌍 Earth Smart</Link>
          <div className="space-x-4">
            <Link href="/feed" className="text-gray-600 hover:text-earth-600">Feed</Link>
            <Link href="/learn" className="text-earth-600 font-semibold">Learn</Link>
            <Link href="/news" className="text-gray-600 hover:text-earth-600">News</Link>
            <Link href="/tools" className="text-gray-600 hover:text-earth-600">Tools</Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="mb-8 text-4xl font-bold">Learning Platform</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4 h-40 bg-gradient-to-br from-earth-50 to-earth-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
              <p className="mb-2 text-sm text-gray-600">By {course.instructor}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-earth-100 text-earth-700 px-2 py-1 rounded">{course.level}</span>
                <button className="text-earth-600 font-semibold hover:text-earth-700">Enroll →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
