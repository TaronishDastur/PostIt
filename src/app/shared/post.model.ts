export class Post {
  title: string;
  content: string;
  id: string;
  createdBy: string;
  image: { data: any; contentType: String };

  constructor(t, c, img, user, id?) {
    this.title = t;
    this.content = c;
    this.id = id || null;
    this.createdBy = user;
    this.image = img;
  }
}
