import React from 'react';
import { FestivalCalendar } from '../components/culture/FestivalCalendar';

export const CulturePage: React.FC = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
      <div className="max-w-2xl">
        <p className="font-mono-data text-xs text-[#5C5B56]">
          Living Traditions · Cuisine · Stewardship
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-medium text-[#161614] sm:text-5xl">
          Culture, kitchens &amp;{' '}
          <em className="italic font-normal text-[#1E3F31]">seasonal rhythm</em>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C5B56] sm:text-base">
          Time your journey around harvest dances and bamboo music stages, seek
          out hearth-cooked regional dishes, and travel with quiet respect
          across fragile hill valleys.
        </p>
      </div>

      <div className="mt-12">
        <FestivalCalendar />
      </div>
    </div>
  );
};
