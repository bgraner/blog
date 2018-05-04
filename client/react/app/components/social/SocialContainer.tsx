import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import NavBar from '../navbar';

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

  inviteFriend(params: object ): Promise<boolean> {
    return;
  }

  handleSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const { history } = this.props;
    const { friendEmail } = this.state;

    return this.inviteFriend({ friendEmail })
      .then(() => history.push('/today'))
      .catch(err => {
        console.log('Error logging in!', err);
        this.setState({ error: 'Invalid credentials' });
      });
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
        <form onSubmit={this.handleSubmit.bind(this)}>
            <input
              type='text'
              className='input-default -large'
              placeholder='Username'
              name='username'
              value={this.state.friendEmail}
              onChange={this.onUpdateInput.bind(this)} />

            <button
              className='btn-default btn-sm'
              type='submit'>
              Log in
            </button>

            <small className='text-red'
              style={{ marginLeft: 16 }}>
              {this.state.error || ''}
            </small>

            <div style={{ marginTop: 16 }}>
              <small>
                Or click <Link to='signup'>here</Link> to sign up!
              </small>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SocialContainer;
