import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import NavBar from '../navbar';

interface RewardState {
}

class RewardContainer extends React.Component<RouteComponentProps<{}>, RewardState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { history } = this.props;
  }

  render() {
    // const { } = this.props;
    // const { } = this.state;

    return (
      <div>
        <NavBar
          title='Social'
          linkTo='/today'
          history={history} />

        <div className='default-container'>
            Rewards Go Here
        </div>
      </div>
    );
  }
}

export default RewardContainer;
