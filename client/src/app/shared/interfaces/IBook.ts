export interface IBook {
  title: string,
  author: string,
  genre: string,
  year: number,
  description: string,
  cover: string,
  isbn: string,
  pagesCount: number,
  price: number,
  qty?: number,
  creationDate?: Date,
  currentRating?: number,
  ratingPoints?: number,
  ratedCount?: number,
  purchasesCount?: number,
  comments?: Comment[]
}
