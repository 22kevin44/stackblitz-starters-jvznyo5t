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
  
  // --- キャラクターの移動状態 ---
  const [charPos, setCharPos] = useState(110); // 右端からスタート
  const [isFacingRight, setIsFacingRight] = useState(false); // 最初は左向き

  // キャラクター移動アニメーション
  useEffect(() => {
    if (currentCategory) return;
    const interval = setInterval(() => {
      setCharPos(prev => {
        if (isFacingRight) {
          // 右に進んでいる時：110%を超えたら左に反転
          if (prev > 110) { setIsFacingRight(false); return prev; }
          return prev + 0.4;
        } else {
          // 左に進んでいる時：-20%を下回ったら右に反転
          if (prev < -20) { setIsFacingRight(true); return prev; }
          return prev - 0.4;
        }
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isFacingRight, currentCategory]);

  // 全問題数の集計
  const categories = Object.keys(CATEGORY_DATA || {});
  let totalQuestions = 0;
  categories.forEach(key => {
    const list = CATEGORY_DATA[key];
    if (list && list.length > 0 && list[0].question !== "IMAGE_MODE") {
      totalQuestions += list.length;
    }
  });

  const handleStart = (catName: string) => {
    const rawData = CATEGORY_DATA[catName];
    if (!rawData || rawData.length === 0) return;
    setIsFlipped(false);
    setShowResult(false);
    setCurrentIndex(0);
    setMissedCards([]);
    setIsReviewMode(false);
    setCurrentCategory(catName);
    if (rawData[0].question === "IMAGE_MODE") {
      setCards(rawData);
    } else {
      const shuffled = [...rawData].sort(() => Math.random() - 0.5);
      setCards(shuffled.slice(0, 10));
    }
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

  // 1. トップ画面
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-6 font-sans text-black text-center overflow-hidden">
        {/* キャラクターエリア */}
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
          {/* 下の線(border)は削除しました */}
        </div>

        <h1 className="text-3xl font-black mb-1 tracking-tighter border-b-4 border-black pb-1 uppercase">世界遺産王への道</h1>
        <p className="text-[10px] font-bold tracking-[0.2em] mb-12 text-gray-400">TOTAL: {totalQuestions} QUESTIONS</p>
        
        <div className="w-full max-w-md grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const list = CATEGORY_DATA[cat] || [];
            const count = list.length;
            const isImage = count > 0 && list[0]?.question === "IMAGE_MODE";
            return (
              <button
                key={cat}
                disabled={count === 0}
                onClick={() => handleStart(cat)}
                className={`w-full py-5 border-2 border-black rounded-lg font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all
                  ${isImage ? 'bg-gray-200' : count === 0 ? 'bg-gray-50 text-gray-300 border-gray-200' : 'bg-white hover:bg-gray-50'}`}
              >
                <span className="block truncate px-1">{isImage ? `🖼️ ${cat}` : cat}</span>
                {!isImage && <span className="text-[9px] font-normal opacity-50">({count}問)</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. 画像表示モード
  if (cards.length > 0 && cards[0].question === "IMAGE_MODE") {
    return (
      <div className="min-h-screen bg-[#111] flex flex-col items-center p-6 text-white text-center">
        <div className="w-full max-w-md flex justify-between items-center mb-6">
          <button onClick={() => setCurrentCategory(null)} className="text-white text-[10px] font-black border-b border-white pb-0.5 tracking-widest uppercase">← BACK</button>
          <span className="text-white text-xs font-bold">{currentCategory}</span>
        </div>
        <div className="flex-1 w-full max-w-md bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
          <img src={cards[0].answer} className="max-w-full max-h-full object-contain shadow-2xl" alt="Reference" />
        </div>
      </div>
    );
  }

  // 3. 結果画面
  if (showResult || !cards[currentIndex]) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-6 text-black text-center">
        <div className="w-full max-w-md bg-white p-10 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <h2 className="text-xl font-black mb-8 relative z-10 uppercase tracking-widest">{isReviewMode ? '試練突破' : '学習完了'}</h2>
          <div className="mb-10 relative z-10 text-4xl font-black">
            <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Missed</p>
            {missedCards.length}
          </div>
          <div className="space-y-3 relative z-10">
            {missedCards.length > 0 && (
              <button 
                onClick={() => {
                  setCards([...missedCards].sort(() => Math.random() - 0.5));
                  setMissedCards([]);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  setShowResult(false);
                  setIsReviewMode(true);
                }}
                className="w-full py-4 bg-red-600 text-white rounded-md font-bold text-sm tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]"
              >
                間違えた問題を解き直す
              </button>
            )}
            <button onClick={() => { setCurrentCategory(null); setShowResult(false); }} className="w-full py-4 bg-black text-white rounded-md font-bold text-sm tracking-widest">メニューに戻る</button>
          </div>
        </div>
      </div>
    );
  }

  // 4. クイズ画面本体
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
          <div className={`absolute inset-0 w-full h-full bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-10 shadow-md ${isFlipped ? 'opacity-0' : 'opacity-100'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 10 }}>
            <div className="relative z-10 w-full overflow-y-auto text-center px-1">
              <span className="block text-[10px] font-black text-gray-300 mb-6 tracking-[0.3em] uppercase text-center w-full">Question</span>
              <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{cards[currentIndex].question}</p>
            </div>
          </div>
          <div className={`absolute inset-0 w-full h-full bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-10 shadow-md ${isFlipped ? 'opacity-100' : 'opacity-0'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: isFlipped ? 10 : 0 }}>
            <div className="relative z-10 w-full overflow-y-auto max-h-[380px] text-left text-black">
              <span className="block text-center text-[10px] font-black text-gray-300 mb-6 tracking-[0.3em] uppercase">Answer</span>
              <p className="text-base font-bold leading-relaxed whitespace-pre-wrap">{cards[currentIndex].answer}</p>
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