-- Seed data for Earth Smart

-- Sample users (password = 'password123' hashed)
INSERT INTO users (name, email, password) VALUES
  ('Suman Suryabanshi', 'suman.suryabanshi@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
  ('Jane Smith', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
  ('Mike Builder', 'mike@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample posts
INSERT INTO posts (user_id, content) VALUES
  (1, 'Welcome to Earth Smart! The future of building and connecting starts here. 🌍'),
  (2, 'Just launched my first project on Earth Smart. Amazing platform!'),
  (3, 'Learning to code with Earth Smart courses. Level up every day!');

-- Sample follows
INSERT INTO follows (follower_id, following_id) VALUES
  (2, 1),
  (3, 1),
  (1, 2);

-- Sample courses
INSERT INTO courses (title, description, instructor_id, level, price) VALUES
  ('Web Development Basics', 'Learn HTML, CSS, and JavaScript', 1, 'Beginner', 29.99),
  ('Advanced JavaScript', 'Deep dive into JS and Node.js', 1, 'Intermediate', 49.99),
  ('Full Stack Development', 'Build complete web apps', 2, 'Advanced', 79.99);

-- Sample news
INSERT INTO news (title, description, author, category, url, published_at) VALUES
  ('New AI Tools Launch', 'Latest AI productivity tools for developers', 'Tech News Daily', 'AI', 'https://example.com/1', NOW()),
  ('Web Dev Trends 2024', 'What every developer needs to know', 'Dev Weekly', 'Web', 'https://example.com/2', NOW() - INTERVAL '1 day'),
  ('Startup Funding Report', 'Q1 2024 funding recap', 'Business Insider', 'Business', 'https://example.com/3', NOW() - INTERVAL '2 days');

-- Sample tools
INSERT INTO tools (name, description, category) VALUES
  ('API Manager', 'Manage and monitor all your APIs in one place', 'Development'),
  ('Analytics Dashboard', 'Real-time usage metrics and performance tracking', 'Analytics'),
  ('Collaboration Tool', 'Real-time team collaboration and project management', 'Productivity');
