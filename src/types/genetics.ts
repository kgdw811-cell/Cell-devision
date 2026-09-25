export type ChapterId = 'chapter1' | 'chapter2';
export type SectionId = 'autosomal' | 'abo' | 'sex_linked';

export interface PedigreeNode {
  id: string;
  label: string;
  role: string;
  generation: 1 | 2 | 3;
  sex: 'male' | 'female';
  phenotype: string;
  isTraitExpressed: boolean;
  x: number; // SVG viewBox percentage (0-100) or px
  y: number;
  correctGenotypes: string[]; // accepted answers
  canonicalGenotype: string; // standard display on badge
  options: string[];
  firstAttemptHint: string;
  secondAttemptHint: string;
  stepExplanation: string;
  isHomozygousRecessiveOrDirect?: boolean; // clue priority indicator
}

export interface MarriageLine {
  id: string;
  fromId: string;
  toId: string;
}

export interface OffspringLine {
  id: string;
  marriageFromId: string;
  marriageToId: string;
  childIds: string[];
}

export interface GeneticRuleGuide {
  title: string;
  corePrinciple: string;
  steps: {
    order: number;
    badge: string;
    heading: string;
    description: string;
  }[];
}

export interface Stage {
  id: string;
  chapterId: ChapterId;
  sectionId: SectionId;
  stageNumber: 1 | 2;
  title: string;
  subtitle: string;
  traitName: string;
  traitDetails: string;
  dominantAllele: string;
  recessiveAllele: string;
  alleleMeaning: string;
  svgViewBox: string;
  nodes: PedigreeNode[];
  marriageLines: MarriageLine[];
  offspringLines: OffspringLine[];
  ruleGuide: GeneticRuleGuide;
  summaryTakeaway: string;
}

export interface UserProgress {
  [stageId: string]: {
    solvedNodes: { [nodeId: string]: string }; // nodeId -> user genotype
    completed: boolean;
  };
}
