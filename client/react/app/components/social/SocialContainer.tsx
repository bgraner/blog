import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import NavBar from '../navbar';

interface SocialState {
}

class SocialContainer extends React.Component<RouteComponentProps<{}>, SocialState> {
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
            Friends Go Here
        </div>
      </div>
    );
  }
}

export default SocialContainer;
