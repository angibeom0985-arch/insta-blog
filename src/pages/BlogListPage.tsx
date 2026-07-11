import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  thumbnail: string;
  views: number;
  created_at: string;
}

const CATEGORIES = ['전체', '살림팁', '홈케어', '피부관리', '리빙정보'];

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    document.title = '밤픽 꿀팀 모음';
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, slug, summary, category, thumbnail, views, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === '전체'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-black">
      {/* 타이틀 히어로 영역 */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-black py-12 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="px-3 py-1 text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/30 rounded-full tracking-wider">
            LIVING TIPS & HACKS
          </span>
          <h1 className="font-black text-gray-900 dark:text-white leading-tight" style={{ fontSize: '22px' }}>
            일상의 품격을 높이는 살림 비법 백과
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto" style={{ fontSize: '13px' }}>
            피부 관리 천연 팩 레시피부터 유용한 생활 속 꿀팁까지, 검증된 살림 지혜를 블로그에서 편하게 확인하세요!
          </p>
        </div>
      </section>

      {/* 필터 칩 영역 */}
      <div className="max-w-4xl mx-auto px-4 py-6 border-b border-gray-100 dark:border-zinc-900 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-extrabold text-xs transition-all border ${
              selectedCategory === cat
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
            style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 리스트 본문 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500" style={{ fontSize: '13px' }}>
            포스트를 불러오는 중입니다...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
            <p className="text-gray-400 font-bold" style={{ fontSize: '13px' }}>아직 등록된 꿀팁이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map(post => (
              <article 
                key={post.id} 
                className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 flex flex-col hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors shadow-sm"
              >
                {/* 썸네일 */}
                {post.thumbnail ? (
                  <Link to={`/post/${post.slug}`} className="block aspect-video overflow-hidden border-b border-gray-200 dark:border-zinc-800">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                ) : (
                  <Link to={`/post/${post.slug}`} className="block aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-zinc-800 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-center">
                    <span className="text-3xl">🥚</span>
                  </Link>
                )}

                {/* 카드 세부 내용 */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase" style={{ fontSize: '11px' }}>
                      {post.category}
                    </span>
                    <h2 className="text-gray-900 dark:text-white font-extrabold hover:text-blue-600 dark:hover:text-blue-400 transition-colors" style={{ fontSize: '16px' }}>
                      <Link to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      {post.summary || '상세 내용을 블로그 글에서 확인해 보세요!'}
                    </p>
                  </div>

                  <div className="flex justify-end items-center pt-2 border-t border-gray-100 dark:border-zinc-900 text-gray-400" style={{ fontSize: '11px' }}>
                    <Link to={`/post/${post.slug}`} className="text-blue-600 dark:text-blue-400 font-extrabold flex items-center space-x-1 hover:underline">
                      <span>더 보기</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
