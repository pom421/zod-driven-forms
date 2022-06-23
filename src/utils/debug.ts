export function formatZodErrors(errors: Record<string, { message: string }>) {
  return Object.keys(errors).map((key) => ({
    key,
    message: errors[key].message,
  }));
}
