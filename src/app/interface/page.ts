import { User } from './user';

export interface Page {
  number: number;
totalPages: any;
    content: User[],
    pageable: {
        sort: {
            empty: boolean,
        }
      }}
