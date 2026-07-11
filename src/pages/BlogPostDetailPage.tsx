import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  thumbnail: string;
  views: number;
  created_at: string;
}

const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) throw error || new Error('No post data');
        setPost(data);

        // 동적 타이틀 적용
        document.title = `${data.title} - 밤픽 꿀팀 모음`;

        // 조회수 증가
        supabase
          .from('posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id)
          .then(() => {});

      } catch (err) {
        console.error('Failed to fetch post detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [slug]);

  // 애드센스 인스턴스 초기화
  useEffect(() => {
    if (post) {
      try {
        // 제목 위 광고와 본문 안 광고 총 2개를 초기화
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense initialization error:', e);
      }
    }
  }, [post]);

  const getAdInjectedContent = (content: string) => {
    if (!content) return '';
    
    // 본문 안 구글 애드센스 코드 (중간 지점에 삽입)
    const adCode = `
      <div class="my-8 text-center">
        <ins class="adsbygoogle"
             style="display:block; margin: 24px auto;"
             data-ad-client="ca-pub-2686975437928535"
             data-ad-slot="4879270629"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    `;

    // <h2> 태그가 여러 개 있으면 2번째 <h2> 바로 위에 광고를 끼워넣음
    if (content.includes('<h2>')) {
      const parts = content.split('<h2>');
      if (parts.length > 2) {
        parts[1] = parts[1] + adCode;
        return parts.join('<h2>');
      }
    }

    // <h2>가 없으면 문단 </p> 태그를 세어서 대략 중간 부근에 끼워넣음
    if (content.includes('</p>')) {
      const parts = content.split('</p>');
      if (parts.length > 2) {
        const midIndex = Math.floor(parts.length / 2);
        parts[midIndex] = parts[midIndex] + adCode;
        return parts.join('</p>');
      }
    }

    return content + adCode;
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 bg-white dark:bg-black min-h-screen" style={{ fontSize: '13px' }}>
        포스트를 불러오는 중입니다...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-white dark:bg-black min-h-screen">
        <p className="text-gray-400 font-bold" style={{ fontSize: '13px' }}>해당 포스트를 찾을 수 없습니다</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen py-10">
      <article className="max-w-[600px] mx-auto px-4 space-y-6">
        {/* 뒤로가기 링크 */}
        <Link to="/" className="inline-flex items-center text-xs text-gray-400 hover:text-blue-500 transition-colors font-extrabold" style={{ fontSize: '11px' }}>
          ← 목록으로 돌아가기
        </Link>

        {/* 제목 위 구글 애드센스 광고 */}
        <div className="w-full my-4 border-b border-gray-100 dark:border-zinc-900 pb-4">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-2686975437928535"
               data-ad-slot="4879270629"
               data-ad-format="auto"
               data-full-width-responsive="true" />
        </div>

        {/* 메타데이터 */}
        <div className="space-y-3">
          <span className="px-3 py-1 text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/30 rounded-full tracking-wider">
            {post.category}
          </span>
          <h1 className="text-gray-900 dark:text-white font-black leading-snug" style={{ fontSize: '22px' }}>
            {post.title}
          </h1>
          {/* 조회수/날짜 제거 및 얇은 border 라인 */}
          <div className="border-b border-gray-100 dark:border-zinc-900 pb-3" />
        </div>

        {/* 썸네일 */}
        {post.thumbnail && (
          <div className="rounded-xl overflow-hidden aspect-video border border-gray-200 dark:border-zinc-800">
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 600px 너비 맞춤 본문 렌더러 (중간에 애드센스 삽입) */}
        <div 
          className="text-gray-800 dark:text-gray-200 blog-content-prose"
          style={{ 
            fontSize: '15px', 
            lineHeight: '1.8',
          }}
          dangerouslySetInnerHTML={{ __html: getAdInjectedContent(post.content) }}
        />

        {/* 저장 / 팔로우 유도 배너 */}
        <div className="p-6 rounded-2xl bg-slate-900 dark:bg-zinc-950 border border-blue-500/20 text-white space-y-4 shadow-md text-center">
          <h3 className="font-extrabold text-blue-400" style={{ fontSize: '16px' }}>
            💡 이 꿀팁, 나중에 또 보고 싶다면?
          </h3>
          <p className="text-gray-300" style={{ fontSize: '13px', lineHeight: '1.6' }}>
            나중에 필요할 때 꺼내볼 수 있도록 이 페이지를 <strong>북마크에 저장</strong>해 두세요! 
            매일 유용한 살림 정보와 피부 비결이 가장 빠르게 업로드되는 인스타그램 계정도 팔로우해 보세요!
          </p>
          <a
            href="https://instagram.com/bam._.pick"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-black rounded-xl hover:from-blue-500 hover:to-indigo-400 transition-all shadow-sm"
            style={{ fontSize: '13px', color: '#ffffff' }}
          >
            👉 @bam._.pick 팔로우하기
          </a>
        </div>
      </article>
    </div>
  );
};

export default BlogPostDetailPage;
