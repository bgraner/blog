import * as React from 'react';
import * as moment from 'moment';
import {
  SelectedState,
  keyifyDate,
  formatPoints,
  mapByDate
} from '../../helpers/utils';
import { IScorecard } from '../../helpers/scorecard';
import { IChecklist } from '../../helpers/checklist';

interface DashboardListProps {
  dates: moment.Moment[];
  scorecards: IScorecard[];
  checklists: IChecklist[];
  selected: SelectedState;
  handleDateSelected: (date: moment.Moment) => void;
}

const DashboardList = ({
  dates = [],
  scorecards = [],
  checklists = [],
  selected = {} as SelectedState,
  handleDateSelected
}: DashboardListProps) => {
  const scorecardsByDate = mapByDate(scorecards);
  const checklistsByDate = mapByDate(checklists);
  const { date: selectedDate } = selected;
  const selectedKey = keyifyDate(selectedDate);

  return (
    <table className='dashboard-list-table'>
      <thead>
        <tr>
          <th>Date</th>
          <th>Productivity</th>
          <th>Depression</th>
        </tr>
      </thead>
      <tbody>
        {
          dates.map(date => {
            const key = keyifyDate(date);
            const isSelected = (key === selectedKey);
            const scorecard = scorecardsByDate[key];
            const checklist = checklistsByDate[key];

            return (
              <tr key={key}
                className={`dashboard-list-row ${isSelected && 'selected'}`}
                onClick={() => handleDateSelected(date)}>
                <td className={isSelected ? '' : 'text-blue'}>
                  <span className='dashboard-list-date'>
                    {date.format('ddd MM/DD')}
                  </span>
                </td>
                <td>{scorecard ? formatPoints(scorecard.points) : '--'}</td>
                <td>{checklist ? formatPoints(checklist.points) : '--'}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default DashboardList;
