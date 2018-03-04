import * as reporting from '../reporting';

describe('reporting', () => {
  describe('getTotalStreak', () => {
    it('gets the intersection of two streaks', () => {
      const checklists = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 },
      ];
      const scorecards = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 },
      ];
      const streak = reporting.getTotalStreak(checklists, scorecards);

      expect(streak).toEqual([1, 2]);
    });

    it('handles a single streak', () => {
      const checklists = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 },
      ];
      const scorecards = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 },
      ];
      const streak = reporting.getTotalStreak(checklists, scorecards);

      expect(streak).toEqual([4]);
    });

    it('handles no streak', () => {
      const checklists = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 },
      ];
      const scorecards: reporting.ReportingDatedItem[] = [];
      const streak = reporting.getTotalStreak(checklists, scorecards);

      expect(streak).toEqual([]);
    });
  });

  describe('calculateEarnings', () => {
    it('returns zero for no streaks', () => {
      const streaks: number[] = [];

      expect(reporting.calculateEarnings(streaks)).toBe(0);
    });

    it('calculates earnings for a five-day streak', () => {
      const streaks = [5];

      expect(reporting.calculateEarnings(streaks)).toBe(50);
    });

    it('calculates earnings for a week-long streak', () => {
      const streaks = [7];

      expect(reporting.calculateEarnings(streaks)).toBe(100);
    });

    it('calculates earnings for a month-long streak', () => {
      const streaks = [30];

      expect(reporting.calculateEarnings(streaks)).toBe(620);
    });

    it('calculates earnings for a three month-long streak', () => {
      const streaks = [90];

      expect(reporting.calculateEarnings(streaks)).toBe(2260);
    });

    it('calculates earnings for a six month-long streak', () => {
      const streaks = [180];

      expect(reporting.calculateEarnings(streaks)).toBe(4950);
    });

    it('calculates earnings for a year-long streak', () => {
      const streaks = [365];

      expect(reporting.calculateEarnings(streaks)).toBe(10000);
    });

    it('calculates earnings for multiple streaks', () => {
      const streaks = [5, 7, 1, 30];
      const expected = 50 + 100 + 10 + 620;

      expect(reporting.calculateEarnings(streaks)).toBe(expected);
    });
  });
});
