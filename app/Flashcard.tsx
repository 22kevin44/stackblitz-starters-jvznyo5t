"use client";

import React, { useState, useEffect } from 'react';
import { CATEGORY_DATA, Card } from './data';

export default function WorldHeritageApp() {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // モード選択用
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [missedCards, setMissedCards] = useState<Card[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [charPos, setCharPos] = useState(110); 
  const [isFacingRight, setIsFacingRight] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);

  // キャラクター移動
  useEffect(() => {
    if (currentCategory || selectedCategory || viewingPdf) return;
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
  }, [isFacingRight, currentCategory, selectedCategory, viewingPdf]);

  const categories = Object.keys(CATEGORY_DATA || {});
  let allQuestions: Card[] = [];
  categories.forEach(key => {
    const list = CATEGORY_DATA[key];
    if (list && list.length > 0 && list[0].question !== "IMAGE_MODE") {
      allQuestions = [...allQuestions, ...list];
    }
  });

  // モード選択後の開始処理
  const handleStart = (catName: string, mode: 'random' | 'sequential') => {
    let sourceCards = catName === "全問題シャッフル" ? allQuestions : (CATEGORY_DATA[catName] || []);
    if (sourceCards.length === 0) return;

    setIsFlipped(false);
    setShowResult(false);
    setCurrentIndex(0);
    setMissedCards([]);
    setIsReviewMode(false);
    setSelectedCategory(null); // モード選択画面を閉じる
    setCurrentCategory(catName);

    if (mode === 'random') {
      const shuffled = [...sourceCards].sort(() => Math.random() - 0.5);
      setCards(shuffled.slice(0, 10)); // ランダムは10問
    } else {
      // 順番通りモード（全件）
      setCards([...sourceCards]);
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

  // 1. PDFビューワー（最優先）
  if (viewingPdf) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col animate-in fade-in duration-200">
        <div className="flex justify-between items-center p-4 bg-gray-900 text-white border-b border-gray-700">
          <div className="text-left">
            <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-tighter">Text View</p>
            <p className="text-xs font-black truncate">閲覧中：{viewingPdf.split('/').pop()}</p>
          </div>
          <button onClick={() => setViewingPdf(null)} className="px-6 py-2 bg-red-600 text-white rounded-full font-black text-sm shadow-xl active:scale-90 transition-all">× 閉じる</button>
        </div>
        <div className="flex-1 w-full bg-white overflow-hidden relative">
          <object data={viewingPdf} type="application/pdf" className="w-full h-full">
            <div className="flex flex-col items-center justify-center h-full p-10 text-center text-black">
              <p className="mb-4 font-bold">PDFを表示できませんでした</p>
              <a href={viewingPdf} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold">別タブで開く</a>
            </div>
          </object>
        </div>
      </div>
    );
  }

  // 2. モード選択画面（ワンクッション）
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-6 text-black text-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-black mb-2 uppercase tracking-tight">{selectedCategory}</h2>
          <p className="text-[10px] text-gray-400 mb-8 font-bold tracking-widest uppercase">Select Mode</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleStart(selectedCategory, 'random')}
              className="w-full py-6 bg-red-50 border-2 border-red-600 text-red-600 rounded-lg font-black text-lg shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              ランダム10問
            </button>
            <button 
              onClick={() => handleStart(selectedCategory, 'sequential')}
              className="w-full py-6 bg-blue-50 border-2 border-blue-600 text-blue-600 rounded-lg font-black text-lg shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              最初から順番に
            </button>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="w-full py-3 bg-gray-100 border-2 border-black text-black rounded-lg font-bold text-sm mt-4"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    );
  }

// 3. トップ画面
if (!currentCategory) {
  const getDaysUntilExam = () => {
    const targetDate = new Date(2026, 6, 12); 
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysUntilExam();

  return (
    <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-4 font-sans text-[#444] text-center overflow-hidden">
      
      {/* キャラクター（サイズを大きくし、ロゴとの重なりを防ぐ余白を設定） */}
      <div className="relative w-full h-24 mb-2 pointer-events-none">
        <div className="absolute bottom-0 transition-transform duration-100" style={{ left: `${charPos}%`, transform: isFacingRight ? 'scaleX(-1)' : 'scaleX(1)' }}>
          <img src="/runfumika.png" className="h-20 w-auto opacity-100" alt="running" />
        </div>
      </div>
      
      {/* タイトルロゴ画像（ファイル名を title.png に修正し、サイズを最適化） */}
      <div className="mb-4 flex justify-center w-full max-w-sm">
        <img 
          src="/tittle.png" 
          alt="世界遺産王への道" 
          className="w-full h-auto max-h-48 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* カウントダウン部分 */}
      <div className="mb-10 flex flex-col items-center">
        <div className="w-12 h-[1px] bg-[#ddd] mb-3"></div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#999] mb-1 uppercase">
          July 12 Test Countdown
        </p>
        <p className="text-sm font-medium text-[#666]">
          {daysLeft > 0 ? (
            <>試験まであと <span className="text-2xl font-black text-[#b22d35] mx-1 italic">{daysLeft}</span> 日</>
          ) : daysLeft === 0 ? (
            <span className="text-[#b22d35] font-bold animate-pulse text-lg">本日、決戦の日です</span>
          ) : (
            <span className="text-[#999]">試験期間が終了しました</span>
          )}
        </p>
        <div className="w-12 h-[1px] bg-[#ddd] mt-3"></div>
      </div>

      {/* ボタンメニュー（グリッドのバランスを調整） */}
      <div className="w-full max-w-xl">
        <div className="grid grid-cols-4 gap-3">
          {/* 全問題シャッフル */}
          <button 
            onClick={() => setSelectedCategory("全問題シャッフル")} 
            className="flex flex-col items-center justify-center py-3 px-1 border border-[#b22d35] rounded-md font-bold text-[10px] bg-white text-[#b22d35] shadow-sm active:scale-95 transition-all"
          >
            <span className="leading-tight">全問題</span>
            <span className="leading-tight">シャッフル</span>
            <span className="text-[8px] font-normal opacity-70 mt-1">({allQuestions.length})</span>
          </button>

          {/* カテゴリ別ボタン */}
          {categories.map((cat) => {
            if (cat === "日本の遺産登録基準") return null;
            const list = CATEGORY_DATA[cat] || [];
            const count = list.length;
            return (
              <button 
                key={cat} 
                disabled={count === 0} 
                onClick={() => setSelectedCategory(cat)} 
                className={`flex flex-col items-center justify-center py-3 px-1 border rounded-md font-medium text-[10px] shadow-sm active:scale-95 transition-all ${
                  count === 0 
                    ? 'bg-[#f9f9f9] text-[#ccc] border-[#eee]' 
                    : 'bg-white text-[#444] border-[#ddd] hover:border-[#bbb]'
                }`}
              >
                <span className="truncate w-full px-0.5">{cat}</span>
                <span className="text-[8px] font-normal opacity-50 mt-1">({count})</span>
              </button>
            );
          })}

          {/* 学習メモ */}
          <a 
            href="https://docs.google.com/document/d/14_XMcn05UAqzPfNN6R-OMmwP5SXNen289CQgthOB9wY/edit?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center justify-center py-3 px-1 border border-[#ddd] bg-[#fdfdfd] rounded-md font-medium text-[10px] text-[#666] shadow-sm active:scale-95 transition-all"
          >
            <span className="leading-tight">学習メモ</span>
          </a>

          {/* PDFテキスト類 */}
          {[
            { label: "基礎知識", url: "/kiso-text.pdf" },
            { label: "日本 1", url: "/textjapan1.pdf" },
            { label: "日本 2", url: "/textjapan2.pdf" },
            { label: "世界 1", url: "/textworld1.pdf" },
            { label: "世界 2", url: "/textworld2.pdf" },
            { label: "世界 3", url: "/textworld3.pdf" },
            { label: "世界 4", url: "/textworld4.pdf" },
            { label: "世界 5", url: "/textworld5.pdf" },
            { label: "世界 6", url: "/textworld6.pdf" },
            { label: "世界 7", url: "/textworld7.pdf" },
            { label: "世界 8", url: "/textworld8.pdf" }
          ].map((textBtn) => {
            const isLinked = textBtn.url !== "#";
            return (
              <button 
                key={textBtn.label} 
                onClick={() => isLinked && setViewingPdf(textBtn.url)} 
                className={`flex flex-col items-center justify-center py-3 px-1 border rounded-md font-medium text-[10px] transition-all ${
                  isLinked 
                    ? 'border-[#d1dce5] bg-[#f0f4f8] text-[#5a7b9a] shadow-sm active:scale-95' 
                    : 'border-[#eee] bg-white text-[#ddd] cursor-not-allowed'
                }`}
              >
                <span className="leading-tight">{textBtn.label}</span>
                <span className="text-[8px] opacity-70">テキスト</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

  // 4. クイズ画面・結果画面（ロジック維持）
  const currentCard = cards[currentIndex];
  if (showResult || !currentCard) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-6 text-black text-center">
        <div className="w-full max-w-md bg-white p-10 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
          <h2 className="text-xl font-black mb-8 uppercase tracking-widest">{isReviewMode ? '試練突破' : '学習完了'}</h2>
          <div className="mb-10 text-4xl font-black"><p className="text-xs font-bold text-gray-400 mb-1 uppercase">Missed</p>{missedCards.length}</div>
          <div className="space-y-3">
            {missedCards.length > 0 && (
              <button onClick={() => { setCards([...missedCards].sort(() => Math.random() - 0.5)); setMissedCards([]); setCurrentIndex(0); setIsFlipped(false); setShowResult(false); setIsReviewMode(true); }} className="w-full py-4 bg-red-600 text-white rounded-md font-bold text-sm shadow-[3px_3px_0px_0px_rgba(220,38,38,0.2)]">間違えた問題を解き直す</button>
            )}
            <button onClick={() => { setCurrentCategory(null); setShowResult(false); }} className="w-full py-4 bg-black text-white rounded-md font-bold text-sm tracking-widest">メニューに戻る</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center p-6 font-sans text-black">
      <div className="mt-4 mb-4 w-full max-w-md flex justify-between items-center">
        <button onClick={() => setCurrentCategory(null)} className="text-[10px] font-black border-b-2 border-black pb-0.5 uppercase tracking-widest">← Stop</button>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isReviewMode ? 'Review Mode' : currentCategory}</p>
          <p className="text-sm font-black italic">{currentIndex + 1} / {cards.length}</p>
        </div>
      </div>
      {!isReviewMode && (
        <div className="mb-6 w-full max-w-md grid grid-cols-4 gap-2">
          {[
            { label: '«10', delta: -10 },
            { label: '‹1',  delta: -1  },
            { label: '1›',  delta: +1  },
            { label: '10»', delta: +10 },
          ].map(({ label, delta }) => {
            const next = currentIndex + delta;
            const disabled = next < 0 || next >= cards.length;
            return (
              <button
                key={label}
                disabled={disabled}
                onClick={() => { setIsFlipped(false); setTimeout(() => setCurrentIndex(next), 150); }}
                className={`py-2 text-xs font-black tracking-widest border-2 rounded transition-all
                  ${disabled
                    ? 'border-gray-200 text-gray-300 bg-white cursor-not-allowed'
                    : 'border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
      <div className="relative w-full max-w-md h-[500px]" style={{ perspective: '1200px' }} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <div className={`absolute inset-0 w-full h-full bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-10 shadow-md ${isFlipped ? 'opacity-0' : 'opacity-100'}`} style={{ backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 10 }}>
            <img src="/runfumika.png" className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none" />
            <div className="relative z-10 w-full overflow-y-auto text-center px-1">
              <span className="block text-center text-[10px] font-black text-gray-300 mb-6 tracking-[0.3em] uppercase w-full">Question</span>
              <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{currentCard.question}</p>
            </div>
          </div>
          <div className={`absolute inset-0 w-full h-full bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-10 shadow-md ${isFlipped ? 'opacity-100' : 'opacity-0'}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: isFlipped ? 10 : 0 }}>
            <img src="/runfumika.png" className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none" />
            <div className="relative z-10 w-full overflow-y-auto max-h-[380px] text-left text-black px-1">
              <span className="block text-center text-[10px] font-black text-gray-300 mb-6 tracking-[0.3em] uppercase w-full">Answer</span>
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