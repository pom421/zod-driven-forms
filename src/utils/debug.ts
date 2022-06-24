import { z } from "zod";

import { ZodErrors } from "../types";

export function formatZodErrors<T extends z.ZodType<any, any, any>>(
  errors: ZodErrors<T>
) {
  return Object.keys(errors).map((key) => ({
    key,
    message: errors[key]?.message,
  }));
}
