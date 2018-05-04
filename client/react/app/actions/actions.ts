import { Dispatch, combineReducers } from 'redux';
import * as ac from './actionConstants';

import {
  IScorecard,
  fetchScorecards,
  fetchScorecard,
  toggleScorecardTask,
  findOrCreateByDate as findOrCreateScorecard
} from '../helpers/scorecard';

import {
  IChecklist,
  IQuestion,
  fetchChecklists,
  fetchChecklist,
  updateChecklistScore,
  findOrCreateByDate as findOrCreateChecklist
} from '../helpers/checklist';

import { Task } from '../helpers/tasks';

import {
  Entry,
  fetchEntries,
  fetchEntry,
  findOrCreateByDate as findOrCreateEntry
} from '../helpers/entries';

import {
  SelectedState,
  ChallengeState,
  MappedItems,
  mapByDate,
  mapById,
  keyifyDate
} from '../helpers/utils';

import { ReportingStats, fetchAllStats } from '../helpers/reporting';

import { IUser, fetchCurrentUser } from '../helpers/auth';

import {
  IChallenge,
  fetchActiveChallenges,
  fetchMyChallenges,
  fetchByDate as fetchChallengesByDate,
  toggleChallengeByDate
} from '../helpers/challenges';

// Actions
export interface IAction {
  type: string;
  payload?: any; // TODO: use generic type?
}

export interface ViewAction extends IAction {
  view: string;
}

export const updateCurrentView = (view: string) => {
  return {
    view,
    type: ac.UPDATE_VIEW
  };
};

export const selectDate = (payload: SelectedState) => {
  return {
    payload,
    type: ac.SELECT_DATE
  };
};

export const getScorecards = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_SCORECARDS });

    return fetchScorecards()
      .then(scorecards => {
        return dispatch({
          type: ac.RECEIVE_SCORECARDS,
          payload: scorecards
        });
      });
  };
};

export const getScorecard = (id: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_SCORECARD });

    return fetchScorecard(id)
      .then(scorecard => {
        return dispatch({
          type: ac.RECEIVE_SCORECARD,
          payload: scorecard
        });
      });
  };
};

export const getScorecardByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_SCORECARD });

    return findOrCreateScorecard(date)
      .then(scorecard => {
        return dispatch({
          type: ac.RECEIVE_SCORECARD,
          payload: scorecard
        });
      });
  };
};

export const toggleTask = (scorecard: IScorecard, task: Task) => {
  const { id: scorecardId, tasks = [] } = scorecard;
  const { id: taskId, isComplete: isCurrentlyComplete = false } = task;
  const isComplete = !isCurrentlyComplete;
  const update = {
    ...scorecard,
    tasks: tasks.map(t => {
      return t.id === taskId ? { ...t, isComplete } : t;
    })
  };

  return (dispatch: Dispatch<IAction>) => {
    // Optimistic update
    dispatch({
      type: ac.UPDATE_SCORECARD,
      payload: update
    });

    return toggleScorecardTask(scorecardId, taskId, isComplete)
      .then(success => {
        // Do nothing, only revert if update fails
      })
      .catch(err => {
        console.log('Error toggling task!', err);
        // Revert if actual update failed
        return dispatch({
          type: ac.UPDATE_SCORECARD,
          payload: scorecard,
          error: err // TODO: handle errors better in redux
        });
      });
  };
};

export const getChecklists = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_CHECKLISTS });

    return fetchChecklists()
      .then(checklists => {
        return dispatch({
          type: ac.RECEIVE_CHECKLISTS,
          payload: checklists
        });
      });
  };
};

export const getChecklist = (id: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_CHECKLIST });

    return fetchChecklist(id)
      .then(checklist => {
        return dispatch({
          type: ac.RECEIVE_CHECKLIST,
          payload: checklist
        });
      });
  };
};

export const getChecklistByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_CHECKLIST });

    return findOrCreateChecklist(date)
      .then(checklist => {
        return dispatch({
          type: ac.RECEIVE_CHECKLIST,
          payload: checklist
        });
      });
  };
};

export const updateScore = (
  checklist: IChecklist,
  question: IQuestion,
  score: number
) => {
  return (dispatch: Dispatch<IAction>) => {
    const { id: checklistId, questions = [] } = checklist;
    const { id: questionId } = question;

    return updateChecklistScore(checklistId, questionId, score)
      .then(() => {
        const update = {
          ...checklist,
          questions: questions.map(q => {
            return (q.id === questionId) ? { ...q, score } : q;
          })
        };

        return dispatch({
          type: ac.UPDATE_CHECKLIST,
          payload: update
        });
      })
      .catch(err => {
        // TODO: improve error handling in redux
        console.log('Error updating score!', err);
      });
  };
};

export const getEntries = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_ENTRIES });

    return fetchEntries()
      .then(entries => {
        return dispatch({
          type: ac.RECEIVE_ENTRIES,
          payload: entries
        });
      });
  };
};

export const getEntry = (id: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_ENTRY });

    return fetchEntry(id)
      .then(entry => {
        return dispatch({
          type: ac.RECEIVE_ENTRY,
          payload: entry
        });
      });
  };
};

export const getEntryByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_ENTRY });

    return findOrCreateEntry(date)
      .then(entry => {
        return dispatch({
          type: ac.RECEIVE_ENTRY,
          payload: entry
        });
      });
  };
};

export const getCurrentUser = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_CURRENT_USER });

    return fetchCurrentUser()
      .then(user => {
        return dispatch({
          type: ac.RECEIVE_CURRENT_USER,
          payload: user
        });
      });
  };
};

export const getAllStats = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_ALL_STATS });

    return fetchAllStats()
      .then(stats => {
        return dispatch({
          type: ac.RECEIVE_ALL_STATS,
          payload: stats
        });
      });
  };
};

export const getActiveChallenges = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_ALL_CHALLENGES });

    return fetchActiveChallenges()
      .then(challenges => {
        return dispatch({
          type: ac.RECEIVE_ALL_CHALLENGES,
          payload: challenges
        });
      });
  };
};

export const getMyChallenges = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_MY_CHALLENGES });

    return fetchMyChallenges()
      .then(challenges => {
        return dispatch({
          type: ac.RECEIVE_MY_CHALLENGES,
          payload: challenges
        });
      });
  };
};

export const getChallengesByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: ac.REQUEST_CHALLENGES });

    return fetchChallengesByDate(date)
      .then(challenges => {
        return dispatch({
          type: ac.RECEIVE_CHALLENGES,
          payload: { date, challenges }
        });
      });
  };
};