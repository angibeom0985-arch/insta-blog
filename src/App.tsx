import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogLayout from './components/BlogLayout';
import BlogListPage from './pages/BlogListPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';

function App() {
  return (
    <BrowserRouter>
      <BlogLayout>
        <Routes>
          <Route path="/" element={<BlogListPage />} />
          <Route path="/post/:slug" element={<BlogPostDetailPage />} />
          <Route path="*" element={<BlogListPage />} />
        </Routes>
      </BlogLayout>
    </BrowserRouter>
  );
}

export default App;
