import { baseApi } from "@/app/baseApi"
import { PAGE_SIZE } from "@/common/constants"
import { DefaultResponse, defaultResponseSchema } from "@/common/types"
import {
  type GetTasksResponse,
  getTasksSchema,
  type TaskOperationResponse,
  taskOperationResponseSchema,
  type UpdateTaskModel,
} from "./tasksApi.types"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { page: number } }>({
      query: ({ todolistId, params }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        params: { ...params, count: PAGE_SIZE },
      }),
      extraOptions: { dataSchema: getTasksSchema },
      /*transformResponse: (res: GetTasksResponse) => {
        try {
          getTasksSchema.parse(res) // 💎 ZOD
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.table(error.issues)
            alert("❌ Zod error. Смотри консоль")
          }
        }
        return res
      },*/
      providesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    addTask: build.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    removeTask: build.mutation<DefaultResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    updateTask: build.mutation<TaskOperationResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

        let patchResults: any[] = []
        cachedArgsForQuery.forEach(({ params }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: params.page } }, (state) => {
                const task = state.items.find((task) => task.id === taskId)
                if (task) {
                  task.status = model.status
                }
              }),
            ),
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi
