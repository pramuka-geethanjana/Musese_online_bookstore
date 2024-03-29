import { User } from './user.model';
import { Book } from './book.model';

export class Comment {
  constructor(
    public _id: string,
    public user: User,
    public comment: string,
    public book: Book,
    public creationDate?: Date
  ) { }
}
