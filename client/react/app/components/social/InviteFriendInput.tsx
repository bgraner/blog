import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import NavBar from '../navbar';

interface InviteFriendState {
  friendEmail: string,
  error: string
}

interface InviteFriendProps {
}

class InviteFriendInput extends React.Component<InviteFriendProps, InviteFriendState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.state = {
      friendEmail: "",
      error: ""
    };
  }

  componentDidMount() {
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
      .then(res => console.log(res.success))
      .catch(err => {
        console.log('Error adding friend!', err);
        this.setState({ error: 'Error adding friend' });
      });
  }

  addFriend(params: object): Promise<any> {
    return Promise.resolve({success:true});
  }

  render() {
    // const { } = this.props;
    // const { } = this.state;

    return (
      <div>
        <form onSubmit={this.handleAddFriend.bind(this)}>
          <input
            type='text'
            className='input-default -large'
            placeholder='Email'
            name='friendEmail'
            value={this.state.friendEmail}
            onChange={this.onUpdateInput.bind(this)} />

          <button
            className='btn-default btn-sm'
            type='submit'>
            Add Friend
            </button>

          <small className='text-red'
            style={{ marginLeft: 16 }}>
            {this.state.error || ''}
          </small>
        </form>
      </div>
    );
  }
}

export default InviteFriendInput;
