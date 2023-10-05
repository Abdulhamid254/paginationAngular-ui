import { User } from './user';

export interface Page {
    content: User[],
    pageable: {
        sort: {
            empty: boolean,
        }
      }}
