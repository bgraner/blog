import * as moment from 'moment';
import { has, extend, times, first, isNumber } from 'lodash';
import { IUser } from './auth';
import { IChecklist, IQuestion } from './checklist';
import { IScorecard } from './scorecard';
import { Task } from './tasks';
import { Entry } from './entries';
import { IChallenge } from './challenges';
import { ReportingStats } from './reporting';

export interface SelectedState {
  date?: moment.Moment;
  checklist: IChecklist;
  scorecard: IScorecard;
  entry: Entry;
}

export interface MappedItems<T> {
  items: number[];
  byDate: {
    [date: string]: T;
  };
  byId: {
    [id: string]: T;
  };
}

export interface ChallengeState {
  all: IChallenge[];
  mine: IChallenge[];
  byDate: {
    [date: string]: IChallenge[];
  };
}

export interface AppState {
  currentUser?: IUser;
  currentView: string;
  checklists: MappedItems<IChecklist>;
  scorecards: MappedItems<IScorecard>;
  entries: MappedItems<Entry>;
  questions: IQuestion[];
  tasks: Task[];
  challenges: ChallengeState;
  selected: SelectedState;
  stats: ReportingStats;
}

export interface DatedItem {
  date?: moment.Moment|Date|string;
}

export interface ItemWithId {
  id: number|string;
}

export interface IDropdownOption {
  value: string;
  subvalue?: string;
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const pluralize = (str: string, n?: number, customPlural?: string): string => {
  const simplePlural = `${str}s`;

  if (!str) return str;
  if (!n) return simplePlural;

  if (n === 1) {
    return str;
  } else {
    return (customPlural && customPlural.length) ? customPlural : simplePlural;
  }
};

export const calculateAverage = (nums: number[] = []): number => {
  if (!nums || !nums.length) return 0;

  const sum = nums.reduce((total, n) => total + n, 0);
  const count = nums.length;

  return sum / count;
};

export const getPercentage = (n: number, total: number): number => {
  if (total === 0) return 0;

  return (n / total) * 100;
};

export const getFormattedPercentage = (n: number, total: number): string => {
  const percentage = getPercentage(n, total);

  return percentage.toFixed(1);
};

export const formatPoints = (points: number = 0): string => {
  const label = points === 1 ? 'point' : 'points';

  return `${points} ${label}`;
};

export const keyifyDate = (date: moment.Moment|Date|string): string => {
  return moment(date).format('MMDDYYYY');
};

export const isDateToday = (date: moment.Moment | Date | string): boolean => {
  return moment(date).isSame(moment(), 'day');
};

// TODO: figure out how to type this better
export const mapById = (list: ItemWithId[] = []): { [id: string]: any; } => {
  return list.reduce((map, item) => {
    if (!has(item, 'id')) return map;

    const { id } = item;

    return extend(map, { [id]: item });
  }, {});
};

export const mapByDate = (list: DatedItem[] = []): { [date: string]: any; } => {
  return list.reduce((map, item) => {
    if (!has(item, 'date')) return map;

    const { date } = item;
    const key = keyifyDate(date);

    return extend(map, { [key]: item });
  }, {});
};

export const getPastDates = (days: number = 10): moment.Moment[] => {
  return times(days).map(n => {
    const formatted = moment().subtract(n, 'days').format('YYYY-MM-DD');

    return moment(formatted);
  });
};

export const getStreakStats = (stats: DatedItem[]): number[] => {
  if (!stats || !stats.length) return [];

  // TODO: this currently assumes the stats are sorted in descending
  // order by date, need to fix this to handle unsorted inputs
  return stats
    .map(({ date }) => {
      return moment().diff(date, 'days');
    })
    .reduce((streaks, current, index, list) => {
      const prev = list[index - 1];

      if (isNumber(prev) && current === prev + 1) {
        streaks[streaks.length - 1] += 1;
      } else {
        streaks[streaks.length] = 1;
      }

      return streaks;
    }, []);
};
