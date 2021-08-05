export class User {
  email: string;
  password: string;
  id: string;

  constructor(em, ps, id?) {
    this.email = em;
    this.password = ps;
    this.id = id || null;
  }
}
