export function wrapper(self: unknown, func: (...args: unknown[]) => unknown) {
    return (...args: unknown[]) => func(self, args);
}
