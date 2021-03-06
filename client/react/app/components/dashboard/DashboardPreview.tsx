import * as React from 'react';
import { Link } from 'react-router-dom';
import { isNumber, isArray, groupBy, keys, every } from 'lodash';
import * as moment from 'moment';
import { SelectedState, formatPoints, isDateToday } from '../../helpers/utils';
import { Task, calculateScore } from '../../helpers/tasks';
import { Entry } from '../../helpers/entries';
import { IScorecard } from '../../helpers/scorecard';
import { IChecklist } from '../../helpers/checklist';

interface CategorySubtasksProps {
  category: string;
  subtasks: Task[];
}

// TODO: DRY this up (see ScoreCardOverview)
const DashboardCategorySubtasks = ({
  category,
  subtasks
}: CategorySubtasksProps) => {
  return (
    <div>
      <div className='scorecard-overview-category-label'>
        {category}
      </div>
      {
        subtasks.map((task, key) => {
          const { description, points } = task;
          return (
            <div
              key={key}
              className='scorecard-overview-completed-task clearfix'>
              <span className='pull-left'>{description}</span>
              <span className='pull-right'>
                {formatPoints(points)}
              </span>
            </div>
          );
        })
      }
    </div>
  );
};

interface ScorecardPreviewProps {
  scorecard: IScorecard;
  handleClick: (e: any) => void;
}

// TODO: clean up these preview components
const DashboardScorecardPreview = ({
  scorecard = {} as IScorecard,
  handleClick
}: ScorecardPreviewProps) => {
  const { id: scorecardId, tasks = [] } = scorecard;
  const score = calculateScore(tasks);
  const completed = tasks.filter(t => t.isComplete);
  const grouped = groupBy(completed, 'category');
  const categories = keys(grouped);
  const hasCompleted = completed && (completed.length > 0);

  return (
    <div className='dashboard-scorecard-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Productivity
          <Link to={scorecardId ? `/scorecard/${scorecardId}` : '#'}
            onClick={handleClick}>
            {
              hasCompleted ?
                <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
                <img className='preview-icon' src='assets/pencil.svg' />
            }
          </Link>
        </h4>

        <Link className='preview-link text-active pull-right'
          to={scorecardId ? `/scorecard/${scorecardId}` : '#'}
          onClick={handleClick}>
          {hasCompleted ? 'View' : 'Start'}
        </Link>
      </div>

      <div className={`dashboard-preview-points clearfix ${
        !hasCompleted ? 'hidden' : ''
      }`}>
        <span className='pull-left'>
          {completed.length} {completed.length === 1 ? 'accomplishment' : 'accomplishments'}
        </span>

        <span className='pull-right'>
          {score} {score === 1 ? 'point' : 'points'}
        </span>
      </div>

      <div className='dashboard-preview-scorecard-overview'>
        {
          categories.map((category, key) => {
            const subtasks = grouped[category];

            return (
              <DashboardCategorySubtasks
                key={key}
                category={category}
                subtasks={subtasks} />
            );
          })
        }
      </div>
    </div>
  );
};

interface ChecklistPreviewProps {
  checklist: IChecklist;
  handleClick: (e: any) => void;
}

const DashboardChecklistPreview = ({
  checklist = {} as IChecklist,
  handleClick
}: ChecklistPreviewProps) => {
  const { id: checklistId, questions = [], points } = checklist;
  const isComplete = isArray(questions) && questions.length && every(
    questions,
    q => isNumber(q.score)
  );

  return (
    <div className='dashboard-checklist-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Mood
          <Link to={checklistId ? `/checklist/${checklistId}` : '#'}
            onClick={handleClick}>
            {
              isComplete ?
                <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
                <img className='preview-icon' src='assets/pencil.svg' />
            }
          </Link>
        </h4>

        <Link className='preview-link text-active pull-right'
          to={checklistId ? `/checklist/${checklistId}` : '#'}
          onClick={handleClick}>
          {isComplete ? 'View' : 'Start'}
        </Link>
      </div>

      <div className={`dashboard-preview-points ${!isComplete && 'hidden'}`}>
        {points} depression {points === 1 ? 'point' : 'points'}
      </div>
    </div>
  );
};

interface EntryPreviewProps {
  entry: Entry;
  handleClick: (e: any) => void;
}

const DashboardEntryPreview = ({
  entry = {} as Entry,
  handleClick
}: EntryPreviewProps) => {
  const { id: entryId, content = '' } = entry;
  const hasContent = content && (content.length > 0);
  const wordCount = hasContent ? content.split(' ').length : 0;

  return (
    <div className='dashboard-entry-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Journal
          <Link to={entryId ? `/entry/${entryId}` : '#'}
            onClick={handleClick}>
            {
              hasContent ?
                <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
                <img className='preview-icon' src='assets/pencil.svg' />
            }
          </Link>
        </h4>

        <Link className='preview-link text-active pull-right'
          to={entryId ? `/entry/${entryId}` : '#'}
          onClick={handleClick}>
          {hasContent ? 'View' : 'Start'}
        </Link>
      </div>

      <div className={`dashboard-preview-points ${!hasContent && 'hidden'}`}>
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  );
};

interface DashboardPreviewProps {
  selected: SelectedState;
  handleScorecardClicked: (scorecard: IScorecard, date: moment.Moment) => void;
  handleChecklistClicked: (checklist: IChecklist, date: moment.Moment) => void;
  handleEntryClicked: (entry: Entry, date: moment.Moment) => void;
}

const DashboardPreview = ({
  selected = {} as SelectedState,
  handleScorecardClicked,
  handleChecklistClicked,
  handleEntryClicked
}: DashboardPreviewProps) => {
  const { scorecard, checklist, entry, date = moment() } = selected;
  const isToday = isDateToday(date);

  return (
    <div className='dashboard-preview'>
      <h4 className='dashboard-preview-header date-header'>
        <div className={isToday && 'date-today'}>
          {isToday ? 'Today' : date.format('dddd')}
        </div>
        <div className='date-subheader'>{date.format('MMMM DD, YYYY')}</div>
      </h4>

      <DashboardScorecardPreview
        scorecard={scorecard}
        handleClick={() => handleScorecardClicked(scorecard, date)} />

      <DashboardChecklistPreview
        checklist={checklist}
        handleClick={() => handleChecklistClicked(checklist, date)} />

      <DashboardEntryPreview
        entry={entry}
        handleClick={() => handleEntryClicked(entry, date)} />
    </div>
  );
};

export default DashboardPreview;
