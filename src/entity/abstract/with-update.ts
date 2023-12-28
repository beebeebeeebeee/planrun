export abstract class WithUpdate {
  withUpdate<T extends keyof this, TValue extends this[T]>({
    name,
    value,
  }: {
    name: T;
    value: TValue;
  }): this {
    if (!Object.keys(this).includes(name as string)) return this;
    const clone = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    clone[name] = value;
    return clone;
  }
}
