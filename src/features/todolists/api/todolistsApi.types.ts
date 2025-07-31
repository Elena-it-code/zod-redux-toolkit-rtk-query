import { z } from "zod"
import { baseResponseSchema } from "@/common/types"

export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.string().datetime({ local: true }),
  order: z.number(),
})

export type Todolist = z.infer<typeof todolistSchema>

export const createTodolistResponseSchema = baseResponseSchema(
  z.object({
    item: todolistSchema,
  }),
)

export type CreateTodolistResponse = z.infer<typeof createTodolistResponseSchema>
