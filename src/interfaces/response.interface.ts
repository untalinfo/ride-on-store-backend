export interface Result<T> {
  hasError: boolean;
  message: string;
  data: T;
}
