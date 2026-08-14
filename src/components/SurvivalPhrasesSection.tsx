import React, { useState } from 'react';
import { Languages, Volume2, Check, Copy, Sparkles, MessageSquareText } from 'lucide-react';
import { SurvivalPhrase } from '../types';

interface SurvivalPhrasesSectionProps {
  phrases?: SurvivalPhrase[];
  destination: string;
  isLargeText: boolean;
}

export const SurvivalPhrasesSection: React.FC<SurvivalPhrasesSectionProps> = ({
  phrases,
  destination,
  isLargeText,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  if (!phrases || phrases.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-8 text-center shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000]">
        <Languages className="mx-auto h-12 w-12 text-stone-400" />
        <h3 className="mt-3 text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">Local Language & Phrases</h3>
        <p className="mt-1 text-sm font-medium text-stone-500 dark:text-stone-400">
          No local phrases were generated for this itinerary.
        </p>
      </div>
    );
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSpeak = (text: string, idx: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeakingIdx(idx);
      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const titleSize = isLargeText ? 'text-xl sm:text-2xl font-black' : 'text-lg sm:text-xl font-black';
  const bodySize = isLargeText ? 'text-base' : 'text-sm';

  return (
    <div className="space-y-6" id="survival-phrases-section">
      {/* Header Info */}
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition-colors">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
                <Languages className="h-5 w-5" />
              </span>
              <h2 className={`${titleSize} text-[#1A1A1A] dark:text-[#F3F4F6]`}>
                Local Dialect & Survival Phrases: {destination.split(',')[0]} ({phrases.length} Phrases)
              </h2>
            </div>
            <p className={`mt-1 font-medium text-stone-600 dark:text-stone-300 ${bodySize}`}>
              Essential daily phrases for asking for safe water, vegetarian food, directions, bargaining, and emergency help with phonetic English pronunciation.
            </p>
          </div>
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {phrases.map((phrase, idx) => {
          const category = phrase.category || (phrase as any).situation || 'Everyday';
          const englishPhrase = phrase.english_phrase || (phrase as any).english_meaning || '';
          const localScript = phrase.local_script || (phrase as any).phrase_local || '';
          const pronunciation = phrase.phonetic_pronunciation || (phrase as any).pronunciation || '';
          const usageTip = phrase.usage_tip || '';

          return (
            <div
              key={idx}
              className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-5 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                {/* Category & Audio / Copy Buttons */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-[#F3F4F1] dark:bg-[#14171D] border border-[#1A1A1A] dark:border-[#384152] rounded-lg text-xs font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
                    {category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(localScript || englishPhrase, idx)}
                      className={`p-1.5 rounded-lg border border-[#1A1A1A] dark:border-[#384152] transition ${
                        speakingIdx === idx
                          ? 'bg-[#C5E876] text-[#1A1A1A]'
                          : 'bg-white dark:bg-[#14171D] text-stone-600 dark:text-stone-300 hover:bg-[#FAF9F5]'
                      }`}
                      title="Audio pronunciation"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(`${localScript} (${pronunciation}) - ${englishPhrase}`, idx)}
                      className="p-1.5 rounded-lg border border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#14171D] text-stone-600 dark:text-stone-300 hover:bg-[#FAF9F5] transition"
                      title="Copy phrase"
                    >
                      {copiedIdx === idx ? (
                        <Check className="h-3.5 w-3.5 text-[#10B981]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Local Phrase & Script */}
                <div className="bg-[#FAF9F5] dark:bg-[#14171D] p-3 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152]">
                  <p className="text-base font-black text-[#1A1A1A] dark:text-[#F3F4F6] tracking-wide">
                    {localScript}
                  </p>
                  <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1">
                    "{englishPhrase}"
                  </p>
                </div>

                {/* Phonetic Pronunciation Guide */}
                {pronunciation && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B5CF6] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-[#2C194D] px-2.5 py-1.5 rounded-xl border border-[#DDD6FE] dark:border-[#6B21A8]">
                    <Volume2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Say: "{pronunciation}"</span>
                  </div>
                )}

                {/* Usage Tip */}
                {usageTip && (
                  <div className="text-xs font-medium text-stone-600 dark:text-stone-400 flex items-start gap-1.5 pt-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <span>{usageTip}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

