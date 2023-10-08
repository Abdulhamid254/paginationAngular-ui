import { User } from './user';

export interface Page {
totalPages: any;
    content: User[],
    pageable: {
        sort: {
            empty: boolean,
        }
      }}
