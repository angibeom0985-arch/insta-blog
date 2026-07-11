import React from 'react';
import { Link } from 'react-router-dom';

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100 flex flex-col font-sans">
      {/* 1px 보더 격자 스타일 헤더 */}
      <header className="border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link 
              to="/" 
              className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent"
              style={{ fontSize: '22px' }}
            >
              밤픽 꿀팀 모음
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <a 
              href="https://instagram.com/bam._.pick" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors"
              style={{ fontSize: '13px' }}
            >
              인스타그램 바로가기
            </a>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 py-8 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <p className="font-extrabold text-gray-800 dark:text-gray-200" style={{ fontSize: '13px' }}>
            밤픽 꿀팀 모음
          </p>
          <p className="text-gray-400" style={{ fontSize: '11px' }}>
            © 2026 밤픽. All rights reserved. 본 사이트의 모든 꿀팁은 인스타그램 @bam._.pick 계정에서도 확인하실 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
