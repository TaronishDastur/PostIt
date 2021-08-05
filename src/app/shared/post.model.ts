export class Post {
  title: string;
  content: string;
  id: string;
  imagePath: string;
  createdBy: string;

  constructor(t, c, img, user, id?) {
    this.title = t;
    this.content = c;
    this.imagePath = img;
    this.id = id || null;
    this.createdBy = user;
  }
}
