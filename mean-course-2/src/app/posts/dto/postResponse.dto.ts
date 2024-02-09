export class PostResponseDto {
  constructor(
    public _id: string | any,
    public title: string,
    public content: string,
    public imagePath: string,
  ) {
  }
}
