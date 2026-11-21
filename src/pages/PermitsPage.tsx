import React from 'react';
import { PermitChecker } from '../components/permits/PermitChecker';

export const PermitsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
      <div className="max-w-2xl">
        <p className="font-mono-data text-xs text-[#5C5B56]">
          Compliance &amp; Border Checkpost Guide
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-medium text-[#161614] sm:text-5xl">
          Northeast{' '}
          <em className="italic font-normal text-[#1E3F31]">Permit Navigator</em>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C5B56] sm:text-base">
          Know exactly where an Inner Line Permit (ILP), Protected Area Permit
          (PAP), or Restricted Area Permit (RAP) applies—along with current
          fees, official portals, and highway checkpost tips.
        </p>
      </div>

      <div className="mt-10">
        <PermitChecker />
      </div>
    </div>
  );
};
