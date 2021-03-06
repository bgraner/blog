import * as React from 'react';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import EntryPreview from '../entry/EntryPreview';
import { Entry, fetchEntries } from '../../helpers/entries';
import { logout } from '../../helpers/auth';
import './Home.less';

interface HomeProps extends RouteComponentProps<{}> {}

interface HomeState {
  entries: Entry[];
}

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    const { history } = this.props;

    return fetchEntries()
      .then(entries => this.setState({ entries }))
      .catch(err => {
        console.log('Error fetching entries!', err);

        return history.push('/login');
      });
  }

  renderEntries() {
    const { entries = [] } = this.state;

    if (!entries || !entries.length) {
      return null;
    }

    return entries
      .sort((x, y) => {
        return Number(new Date(y.date)) - Number(new Date(x.date));
      })
      .map(entry => {
        const { id, date } = entry;
        const formatted = { ...entry, date: moment(date) };
        const linkTo = `/entry/${id}`;

        return (
          <EntryPreview
            key={id}
            entry={formatted}
            linkTo={linkTo} />
        );
      });
  }

  logout() {
    const { history } = this.props;

    return logout()
      .then(res => {
        return history.push('/login');
      })
      .catch(err => {
        console.log('Error logging out!', err);
      });
  }

  render() {
    const { history } = this.props;

    return (
      <div>
        <NavBar
          title='Blog'
          linkTo='/today'
          history={history} />

        <div className='default-container'>
          <div className='entry-list-container'>
            {this.renderEntries()}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
