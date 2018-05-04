import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import NavBar from '../navbar';
import InviteFriendInput from './InviteFriendInput';

interface SocialState {
  friendEmail: string,
  error: string
}

class SocialContainer extends React.Component<RouteComponentProps<{}>, SocialState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.state = {
      friendEmail: "",
      error: ""
    };
  }

  componentDidMount() {
    const { history } = this.props;
  }

  onUpdateInput(e: any) {
    return this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleAddFriend(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    // const { history } = this.props;
    const { friendEmail } = this.state;

    return this.addFriend({ friendEmail })
      .then(() => "")
      .catch(err => {
        console.log('Error adding friend!', err);
        this.setState({ error: 'Error adding friend' });
      });
  }

  addFriend(params: object): Promise<boolean> {
    return Promise.resolve(true);
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
          <InviteFriendInput />
        </div>
      </div>
    );
  }
}

export default SocialContainer;
