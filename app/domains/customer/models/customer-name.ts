export class CustomerName {
  static MAX_LENGTH = 32;
  static MIN_LENGTH = 1;
  private constructor(private name: string) {}

  static create(name: string) {
    if (
      name.length < CustomerName.MIN_LENGTH ||
      name.length > CustomerName.MAX_LENGTH
    ) {
      throw new Error(
        `顧客の名前は${CustomerName.MIN_LENGTH}文字以上、${CustomerName.MAX_LENGTH}文字以下にしてください。`,
      );
    }

    return new CustomerName(name);
  }

  static fromDto({ name }: { name: string }) {
    return new CustomerName(name);
  }

  get value() {
    return this.name;
  }
}
