import * as React from 'react';
import * as moment from 'moment';
import { isNumber } from 'lodash';
import ChecklistFlowQuestion from './ChecklistFlowQuestion';
import {
  IChecklist,
  IQuestion,
} from '../../helpers/checklist';
import './Checklist.less';

interface ChecklistProps {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
  onScoreChange: (question: IQuestion, score: number) => void;
  onSubmit: () => Promise<void>;
}

interface ChecklistState {
  currentIndex: number;
}

class ChecklistFlow extends React.Component<ChecklistProps, ChecklistState> {
  handleKeyDown: (e: any) => void;

  constructor(props: ChecklistProps) {
    super(props);

    const { questions = [] } = props;
    const currentIndex = questions.reduce((current, { score }, index) => {
      if (current > -1) {
        return current;
      } else {
        return isNumber(score) ? current : index;
      }
    }, -1);

    this.handleKeyDown = this.onKeyDown.bind(this);
    this.state = { currentIndex };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  // TODO: update type
  onKeyDown(e: any) {
    const { onSubmit } = this.props;

    switch (e.key) {
      case 'ArrowRight':
        return this.setNextQuestion();
      case 'ArrowLeft':
        return this.setPreviousQuestion();
      case 'Enter':
        return this.isLastIndex() ? onSubmit() : this.setNextQuestion();
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        return this.handleKeyboardScoreChange(e);
      default:
        return null;
    }
  }

  isLastIndex() {
    const { currentIndex } = this.state;
    const { questions } = this.props;

    return currentIndex === questions.length - 1;
  }

  getNextIndex() {
    const { currentIndex } = this.state;
    const { questions } = this.props;

    return currentIndex < questions.length - 1
      ? currentIndex + 1
      : currentIndex;
  }

  setNextQuestion() {
    return this.setState({ currentIndex: this.getNextIndex() });
  }

  getPreviousIndex() {
    const { currentIndex } = this.state;

    return currentIndex > 0 ? currentIndex - 1 : currentIndex;
  }

  setPreviousQuestion() {
    return this.setState({ currentIndex: this.getPreviousIndex() });
  }

  // TODO: update type
  handleKeyboardScoreChange(e: any) {
    const score = Number(e.key) - 1;
    const { currentIndex } = this.state;
    const { questions, onScoreChange } = this.props;
    const question = questions[currentIndex];

    return this.handleScoreChange(question, score);
  }

  handleScoreChange(question: IQuestion, score: number) {
    const { onScoreChange } = this.props;

    onScoreChange(question, score);

    setTimeout(() => this.setNextQuestion(), 200);
  }

  render() {
    const { currentIndex } = this.state;
    const {
      questions,
      date,
      onScoreChange,
      onSubmit
    } = this.props;

    if (!questions || !questions.length) {
      return null;
    }

    return (
      <div className='default-container -narrow checklist-v2'>
        <div className='checklist-header-container clearfix'>
          <div className='checklist-header pull-left'>
            <h3 className='text-light'>
              {date.format('dddd MMMM DD, YYYY')}
            </h3>
          </div>
        </div>

        <div className='checklist-container clearfix'>
          {
            questions.map((question, key) => {
              const offset = (key - currentIndex) * 60;
              return (
                <ChecklistFlowQuestion
                  key={key}
                  question={question}
                  offset={offset}
                  onSelect={score => this.handleScoreChange(question, score)} />
              );
            })
          }
        </div>

        <div className='clearfix'>
          <button
            className={`btn-default pull-left ${
              (currentIndex === 0) ? 'hidden' : ''
            }`}
            onClick={e => this.setPreviousQuestion()}>
            Previous
          </button>

          <button
            className={`btn-default pull-right ${
              (currentIndex === questions.length - 1) ? 'hidden' : ''
            }`}
            onClick={e => this.setNextQuestion()}>
            Next
          </button>

          <button
            className={`btn-primary pull-right ${
              (currentIndex === questions.length - 1) ? '' : 'hidden'
            }`}
            onClick={onSubmit}>
            Done
          </button>
        </div>
      </div>
    );
  }
}

export default ChecklistFlow;
