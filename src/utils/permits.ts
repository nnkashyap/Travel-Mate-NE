import { StateId, TravelerNationality } from '../types/travel';
import { PERMIT_RULES, StatePermitRule } from '../data/permits';

export interface EvaluatedPermitEntry {
  stateId: StateId;
  stateName: string;
  required: boolean;
  code: string;
  label: string;
  feeINR: number;
  feeDisplay: string;
  validity: string;
  portal: string;
  checkposts: string;
  steps: string[];
  note: string;
}

export interface PermitEvaluationReport {
  entries: EvaluatedPermitEntry[];
  requiredCount: number;
  openCount: number;
  estimatedTotalFeeINR: number;
}

export function evaluatePermits(
  nationality: TravelerNationality,
  selectedStates: StateId[]
): PermitEvaluationReport {
  const entries: EvaluatedPermitEntry[] = selectedStates.map((stateId) => {
    const rule: StatePermitRule = PERMIT_RULES[stateId];
    const branch = nationality === 'indian' ? rule.indian : rule.foreign;
    return {
      stateId,
      stateName: rule.stateName,
      ...branch,
    };
  });

  const requiredCount = entries.filter(
    (e) => e.required || e.code === 'PAP-ZONE'
  ).length;
  const openCount = entries.filter(
    (e) => !e.required && e.code === 'OPEN'
  ).length;
  const estimatedTotalFeeINR = entries.reduce((sum, e) => sum + e.feeINR, 0);

  return {
    entries,
    requiredCount,
    openCount,
    estimatedTotalFeeINR,
  };
}
