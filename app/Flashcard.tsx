"use client";

import React, { useState, useEffect } from 'react';
import { CATEGORY_DATA, Card } from './data';

export default function WorldHeritageApp() {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [missedCards, setMissedCards] = useState<Card[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  // キャラクターの移動状態
  const [charPos, setCharPos] = useState(110); 
  const [isFacingRight, setIsFacingRight] = useState(false);

  // --- PDFビューワー用の状態 ---
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);

  // キャラクター移動アニメーション
  useEffect(() => {
    if (currentCategory || viewingPdf) return;
    const interval = setInterval(() => {
      setCharPos(prev => {
        if (isFacingRight) {
          if (prev > 110) { setIsFacingRight(false); return prev; }
          return prev + 0.4;
        } else {
          if (prev < -20) { setIsFacingRight(true); return prev; }
          return prev - 0.4;
        }
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isFacingRight, currentCategory, viewingPdf]);

  const categories = Object.keys(CATEGORY_DATA || {});
  
  // 全問題リストの作成
  let allQuestions: Card[] = [];
  categories.forEach(key => {
    const list = CATEGORY_DATA[key];
    if (list && list.length > 0 && list[0].question !== "IMAGE_MODE") {
      allQuestions = [...allQuestions, ...list];
    }
  });

  const handleStart = (catName: string, isAllShuffle = false) => {
    let sourceCards = isAllShuffle ? allQuestions : (CATEGORY_DATA[catName] || []);
    if (sourceCards.length === 0) return;

    setIsFlipped(false);
    setShowResult(false);
    setCurrentIndex(0);
    setMissedCards([]);
    setIsReviewMode(false);
    setCurrentCategory(isAllShuffle ? "全問題シャッフル" : catName);

    const shuffled = [...sourceCards].sort(() => Math.random() - 0.5);
    setCards(shuffled.slice(0, 10));
  };

  const handleAnswer = (isCorrect: boolean) => {
    const currentCard = cards[currentIndex];
    if (!isCorrect && currentCard) {
      setMissedCards(prev => {
        if (prev.find(c => c.id === currentCard.id)) return prev;
        return [...prev, currentCard];
      });
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < cards.length) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(nextIndex), 150);
    } else {
      setShowResult(true);
    }
  };

  // --- PDFビューワー表示中の画面 ---
  if (viewingPdf) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
          <span className="text-xs font-bold truncate">テキスト閲覧中</span>
          <button 
            onClick={() => setViewingPdf(null)}
            className="px-4 py-2 bg-red-600 rounded-md font-black text-sm uppercase tracking-tighter shadow-lg active:scale-95 transition-transform"
          >
            × 閉じてクイズへ
          </button>
        </div>
        {/* PDF本体を表示 */}
        <iframe src={viewingPdf} className="flex-1 w-full border-none bg-white" title="PDF Viewer" />
      </div>
    );
  }

  // 1. トップ画面
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-4 font-sans text-black text-center overflow-hidden">
        <div className="relative w-full h-16 mb-2 pointer-events-none">
          <div 
            className="absolute bottom-0 transition-transform duration-100"
            style={{ 
              left: `${charPos}%`, 
              transform: isFacingRight ? 'scaleX(-1)' : 'scaleX(1)' 
            }}
          >
            <img src="/runfumika.png" className="h-12 w-auto animate-bounce" alt="running" />
          </div>
        </div>

        <h1 className="text-3xl font-black mb-8 tracking-tighter border-b-4 border-black pb-1 uppercase">世界遺産王への道</h1>
        
        <div className="w-full max-w-xl">
          <div className="grid grid-cols-4 gap-2">
            
            {/* 全問題シャッフル */}
            <button
              onClick={() => handleStart("全問題シャッフル", true)}
              className="flex flex-col items-center justify-center aspect-square border-2 border-red-600 rounded-lg font-black text-[9px] bg-red-50 text-red-600 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <span>全問題</span>
              <span>シャッフル</span>
              <span className="text-[8px] font-normal opacity-70 mt-1">({allQuestions.length})</span>
            </button>

            {/* クイズカテゴリーボタン */}
            {categories.map((cat) => {
              if (cat === "日本の遺産登録基準") return null;
              const list = CATEGORY_DATA[cat] || [];
              const count = list.length;
              return (
                <button
                  key={cat}
                  disabled={count === 0}
                  onClick={() => handleStart(cat)}
                  className={`flex flex-col items-center justify-center aspect-square border-2 border-black rounded-lg font-bold text-[9px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all
                    ${count === 0 ? 'bg-gray-50 text-gray-300 border-gray-200' : 'bg-white hover:bg-gray-50'}`}
                >
                  <span className="truncate w-full px-0.5">{cat}</span>
                  <span className="text-[8px] font-normal opacity-50 mt-1">({count})</span>
                </button>
              );
            })}

            {/* 学習メモ（Googleドキュメント：これは外部リンクで開く） */}
            <a href="https://docs.google.com/document/d/14_XMcn05UAqzPfNN6R-OMmwP5SXNen289CQgthOB9wY/edit?usp=sharing" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center justify-center aspect-square border-2 border-black rounded-lg font-bold text-[10px] bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
            >
              <span>学習メモ</span>
            </a>

            {/* テキストボタン群 */}
            {[
              { label: "基礎知識", url: "/kiso-text.pdf" },
              { label: "日本の遺産1", url: "/textjapan1.pdf" },
              { label: "日本の遺産2", url: "/textjapan2.pdf" },
              { label: "世界の遺産1", url: "#" },
              { label: "世界の遺産2", url: "#" },
              { label: "世界の遺産3", url: "#" },
              { label: "世界の遺産4", url: "#" },
              { label: "世界の遺産5", url: "#" },
              { label: "世界の遺産6", url: "#" },
              { label: "世界の遺産7", url: "#" },
              { label: "世界の遺産8", url: "#" }
            ].map((textBtn) => {
              const isLinked = textBtn.url !== "#";
              return (
                <button 
                  key={textBtn.label} 
                  onClick={() => isLinked && setViewingPdf(textBtn.url)}
                  className={`flex flex-col items-center justify-center aspect-square border-2 rounded-lg font-bold text-[9px] transition-all
                    ${isLinked 
                      ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]' 
                      : 'border-blue-100 bg-blue-50/30 text-blue-200 cursor-not-allowed'}`}
                >
                  <span>{textBtn.label}</span>
                  <span>テキスト</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- クイズ・結果画面のロジック（以前と同様） ---
  const currentCard = cards[currentIndex];
  if (showResult || !currentCard) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-6 text-black text-center">
        <div className="w-full max-w-md bg-white p-10 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
          <h2 className="text-xl font-black mb-8 uppercase tracking-widest">{isReviewMode ? '試練突破' : '学習完了'}</h2>
          <div className="mb-10 text-4xl font-black"><p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Missed</p>{missedCards.length}</div>
          <div className="space-y-3">
            {missedCards.length > 0 && (
              <button onClick={() => { setCards([...missedCards].sort(() => Math.random() - 0.5)); setMissedCards([]); setCurrentIndex(0); setIsFlipped(false); setShowResult(false); setIsReviewMode(true); }}
                className="w-full py-4 bg-red-600 text-white rounded-md font-bold text-sm tracking-widest shadow-[3px_3px_0px_0px_rgba(220,38,38,0.2)]">間違えた問題を解き直す</button>
            )}
            <button onClick={() => { setCurrentCategory(null); setShowResult(false); }} className="w-full py-4 bg-black text-white rounded-md font-bold text-sm tracking-widest">メニューに戻る</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center p-6 font-sans text-black">
      <div className="mt-4 mb-8 w-full max-w-md flex justify-between items-center">
        <button onClick={() => setCurrentCategory(null)} className="text-[10px] font-black border-b-2 border-black pb-0.5 uppercase tracking-widest">← Stop</button>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isReviewMode ? 'Review Mode' : currentCategory}</p>
          <p className="text-sm font-black italic">{currentIndex + 1} / {cards.length}</p>
        </div>
      </div>
      <div className="relative w-full max-w-md h-[500px]" style={{ perspective: '1200px' }} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <div className={`absolute inset-0 w-full h-full bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-10 shadow-md ${isFlipped ? 'opacity-0' : 'opacity-100'}`} style={{ backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 10 }}>
            <img src="/runfumika.png" className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none" />
            <div className="relative z-10 w-full overflow-y-auto text-center px-1">
              <span className="block text-[10px] font-black text-gray-300 mb-6 tracking-[0.3em] uppercase">Question</span>
              <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{currentCard.question}</p>
            </div>
          </div>
          <div className={`absolute inset-0 w-full h-full bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-10 shadow-md ${isFlipped ? 'opacity-100' : 'opacity-0'}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: isFlipped ? 10 : 0 }}>
            <img src="/runfumika.png" className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none" />
            <div className="relative z-10 w-full overflow-y-auto max-h-[380px] text-left text-black">
              <span className="block text-center text-[10px] font-black text-gray-300 mb-6 tracking-[0.3em] uppercase">Answer</span>
              <p className="text-base font-bold leading-relaxed whitespace-pre-wrap">{currentCard.answer}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={`mt-10 w-full max-w-md grid grid-cols-2 gap-6 transition-all duration-300 ${isFlipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <button onClick={(e) => { e.stopPropagation(); handleAnswer(false); }} className="py-4 border-2 border-red-600 bg-white text-red-600 font-black tracking-widest text-sm shadow-[3px_3px_0px_0px_rgba(220,38,38,0.2)]">NG</button>
        <button onClick={(e) => { e.stopPropagation(); handleAnswer(true); }} className="py-4 border-2 border-green-600 bg-white text-green-600 font-black tracking-widest text-sm shadow-[3px_3px_0px_0px_rgba(22,163,74,0.2)]">OK</button>
      </div>
    </div>
  );
}