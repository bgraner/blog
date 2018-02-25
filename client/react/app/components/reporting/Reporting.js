import React from 'react';
import NavBar from '../navbar';
import ReportingChart from './ReportingChart';
import ReportingOverview from './ReportingOverview';
import ReportingStreaks from './ReportingStreaks';
import TopTasks from './TopTasks';
import MoodFrequency from './MoodFrequency';
import ScoresByDay from './ScoresByDay';
import TopMoods from './TopMoods';
import HighImpactTasks from './HighImpactTasks';
import { fetchAllStats } from '../../helpers/reporting';
import './Reporting.less';

class Reporting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: {}
    };
  }

  componentDidMount() {
    return fetchAllStats()
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { history } = this.props;
    const { stats } = this.state;
    const {
      // Checklist stats
      checklistStats = [],
      completedChecklists = [],
      checklistScoresByDay = {},
      depressionLevelFrequency = {},
      checklistQuestionStats = [],
      checklistScoresByTask = [],
      // Scorecard stats
      scorecardStats = [],
      completedScorecards = [],
      scorecardScoresByDay = {},
      totalScoreOverTime = [],
      taskCategoryStats = {},
      // Task stats
      topTasks = []
    } = stats;

    const highImpactTasks = checklistScoresByTask.slice(0, 5);
    const lowImpactTasks = checklistScoresByTask.slice(-5).reverse();

    console.log('stats!', stats);

    return (
      <div>
        <NavBar
          title="Reporting"
          linkTo="/"
          history={history} />

        <div className="default-container">
          <div className="reporting-header-container reporting-component">
            <ReportingOverview
              checklists={completedChecklists}
              scorecards={completedScorecards}
              tasks={topTasks} />
          </div>

          <div className="clearfix">
            <div className="reporting-sidebar-container reporting-component pull-left">
              <h4>Daily Averages</h4>

              <ScoresByDay
                checklistScores={checklistScoresByDay}
                scorecardScores={scorecardScoresByDay} />
            </div>

            <div className="reporting-graph-container reporting-component pull-right">
              <ReportingChart
                checklistStats={checklistStats}
                scorecardStats={scorecardStats} />
            </div>
          </div>

          <div className="clearfix">
            <div className="reporting-component-container reporting-component pull-left">
              <h4>Streaks</h4>

              <ReportingStreaks
                completedChecklists={completedChecklists}
                completedScorecards={completedScorecards} />
            </div>

            <div className="reporting-component-container reporting-component pull-left">
              <h4>Favorite Tasks</h4>

              <TopTasks tasks={topTasks} />
            </div>

            <div className="reporting-component-container reporting-component pull-left">
              <h4>Mood Frequency</h4>

              <MoodFrequency stats={depressionLevelFrequency} />
            </div>
          </div>

          <div className="clearfix">
            <div className="reporting-component-container reporting-component pull-left">
              <h4>Common Issues</h4>

              <TopMoods stats={checklistQuestionStats} />
            </div>

            <div className="reporting-component-container reporting-component pull-left">
              <h4>High-Impact Tasks</h4>

              <HighImpactTasks tasks={highImpactTasks} />
            </div>

            <div className="reporting-component-container reporting-component pull-left">
              <h4>Low-Impact Tasks</h4>

              <HighImpactTasks tasks={lowImpactTasks} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reporting;
