
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

const faqList = [
  { q: "플랫폼 소개 (Platform Intro)", a: "AI Shorts Factory는 AI를 통해 유튜브, 틱톡, 릴스용 숏폼 영상을 자동으로 제작하는 플랫폼입니다." },
  { q: "무료 사용 가능 여부 (Free Usage)", a: "네, 워터마크와 광고가 포함된 100% 무료 플랜을 제공합니다." },
  { q: "숏폼 자동 생성 (Auto Generation)", a: "키워드 입력만으로 스크립트, 음성, 영상을 한 번에 생성합니다." },
  { q: "AI 스크립트 생성 (AI Script)", a: "GPT 기반 AI가 타겟 플랫폼에 최적화된 후킹 문구와 스크립트를 작성합니다." },
  { q: "자동 자막 생성 (Auto Subtitles)", a: "음성을 분석하여 단어 단위로 싱크가 맞는 자막을 자동 생성합니다." },
  { q: "자동 번역 지원 (Auto Translation)", a: "8개 국어 자동 번역을 지원하여 글로벌 채널 운영이 가능합니다." },
  { q: "다국어 영상 제작 (Multilingual Video)", a: "한 번의 클릭으로 여러 언어 버전의 영상을 동시에 제작할 수 있습니다." },
  { q: "유튜브 업로드 (YouTube Upload)", a: "YouTube Data API를 통해 제작된 영상을 즉시 업로드할 수 있습니다." },
  { q: "틱톡 업로드 (TikTok Upload)", a: "틱톡 API 연동을 통해 원클릭 업로드를 지원합니다." },
  { q: "릴스 업로드 (Reels Upload)", a: "인스타그램 그래프 API를 통해 릴스 업로드가 가능합니다." },
  { q: "조회수 예측 (View Prediction)", a: "AI가 제목과 키워드를 분석하여 예상 조회수와 바이럴 점수를 계산합니다." },
  { q: "썸네일 생성 (Thumbnail Gen)", a: "영상 주제에 맞는 고화질 썸네일을 AI가 자동으로 디자인합니다." },
  { q: "제목 생성 (Title Gen)", a: "클릭률(CTR)이 높은 바이럴 제목 10개를 추천해 드립니다." },
  { q: "트렌드 분석 (Trend Analysis)", a: "구글 트렌드와 연동하여 실시간 인기 키워드를 추천합니다." },
  { q: "댓글 분석 (Comment Analysis)", a: "시청자 댓글의 감정을 분석하여 콘텐츠 개선 아이디어를 제공합니다." },
  { q: "AI 뉴스 생성 (AI News)", a: "최신 뉴스를 요약하여 뉴스 형식의 숏폼을 제작합니다." },
  { q: "AI 아바타 진행자 (AI Avatar)", a: "실제 사람 같은 AI 아바타가 영상을 진행하도록 설정할 수 있습니다." },
  { q: "B-roll 자동 삽입 (B-roll Matching)", a: "스크립트 내용에 맞는 배경 영상을 AI가 자동으로 매칭합니다." },
  { q: "자동 편집 (Auto Editing)", a: "컷 편집, 배경음악 삽입, 효과음 적용이 모두 자동화되어 있습니다." },
  { q: "채널 자동 운영 (Auto Channel)", a: "정해진 시간에 맞춰 콘텐츠를 생성하고 업로드하는 자동화 기능을 제공합니다." },
  { q: "다국어 채팅 (Multilingual Chat)", a: "실시간 번역 기능이 포함된 채팅을 통해 글로벌 사용자와 소통하세요." },
  { q: "영상 통화 (Video Call)", a: "WebRTC 기반의 고화질 영상 통화 기능을 지원합니다." },
  { q: "음성 메시지 (Voice Message)", a: "최대 30초 분량의 음성 메시지를 녹음하여 전송할 수 있습니다." },
  { q: "파일 전송 (File Transfer)", a: "사진, 문서 등 다양한 파일을 채팅창에서 안전하게 공유하세요." },
  { q: "API 제공 (B2B API)", a: "기업용 자동 영상 제작 API를 통해 시스템 통합이 가능합니다." },
  { q: "모바일 지원 (Mobile Support)", a: "모바일 웹 환경에 최적화된 UI를 통해 어디서든 제작 가능합니다." },
  { q: "PC 지원 (PC Support)", a: "넓은 화면을 활용한 전문적인 편집 도구와 대시보드를 제공합니다." },
  { q: "글로벌 언어 지원 (Global Languages)", a: "한국어, 영어, 중국어 등 총 8개 주요 언어를 완벽 지원합니다." },
  { q: "보안 정책 (Security)", a: "사용자 데이터와 제작된 콘텐츠는 암호화되어 안전하게 보호됩니다." },
  { q: "향후 업데이트 (Future Updates)", a: "AI 보이스 클로닝, 3D 아바타 등 혁신적인 기능이 추가될 예정입니다." },
];

export default function FAQWindow({ lang }: { lang: Language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = translations[lang].faq;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 sm:w-96 max-h-[500px] bg-card rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col"
          >
            <div className="bg-accent p-4 text-white flex items-center justify-between glow-accent">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <h3 className="font-bold text-sm uppercase tracking-widest">{t.title}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide bg-dark-bg/50">
              {faqList.map((item, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden bg-white/5">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-medium text-text-primary">{item.q}</span>
                    {expandedIndex === i ? <ChevronUp size={14} className="text-text-secondary" /> : <ChevronDown size={14} className="text-text-secondary" />}
                  </button>
                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3 pb-3"
                      >
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-card text-center border-t border-border">
              <p className="text-[10px] text-text-secondary uppercase tracking-widest">{t.poweredBy}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-accent text-white rounded-2xl shadow-lg flex items-center justify-center hover:opacity-90 transition-all glow-accent"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>
    </div>
  );
}
