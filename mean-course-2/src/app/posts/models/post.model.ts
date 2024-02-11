export class PostModel {
  constructor(
    public title: string,
    public content: string,
    public image: string,
    public id?: string | any,
  ) {
  }
}
