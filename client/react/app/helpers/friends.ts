import { extend, groupBy } from 'lodash';
import { HttpResponse, post } from './http';

export interface Friend {
    id: number;
    userId: number;
    friendId: number;
    status: string;
  }

  export const inviteFriend = (params: object): Promise<boolean> => {
    return post('/api/friends', params)
      .then((res: HttpResponse) => res.success);
  };