import { TaskPriority, TaskStatus } from "@/common/enums"
import { z } from "zod"

export const domainTaskSchema = z.object({
  deadline: z.string().nullable(),
  description: z.string().nullable(),
  startDate: z.string().nullable(),
  addedDate: z.string().datetime({ local: true }),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
})

export type DomainTask = z.infer<typeof domainTaskSchema>

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}
