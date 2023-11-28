export function exclude<T, Key extends keyof T>(entity: T, ...keys: Key[]): Omit<T, Key> {
  const newEntity = JSON.parse(JSON.stringify(entity));
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    delete newEntity[key];
  }
  return newEntity;
}
