export type Quote = {
  id: string;
  text: string;
  volume: string;
  work: string;
  year: string;
  hint: string;
  historicalContext: string;
  todayMeaning: string;
  boundary: string;
  sourceUrl: string;
};

export type ReadingRecord = {
  date: string;
  quoteId: string;
  thought: string;
  revealedAt: string;
  updatedAt: string;
};

export type View = 'today' | 'free' | 'history';
