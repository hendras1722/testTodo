'use client'

import { useApi } from '@/composable/useApi'
import { useComputed, useReactive } from '@/composable/useComputed'
import { BaseResponse } from '@/type/baseResponse'
import ArrayMap from '../atoms/ArrayMap'
import { Box, Button, Checkbox, TextField } from '@mui/material'
import { Pencil, Plus, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { Notes } from '@/type/Note'
import { Else, If } from '../atoms/if'
import Modal from '../atoms/Modal'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type Item = { id: number; name: string }

const todoSchema = z.object({
  name: z.string().min(1, 'name required'),
})

const todoItem = z.object({
  itemName: z.string().min(1, 'name required'),
})

type TodoForm = z.infer<typeof todoSchema>
type TodoItemForm = z.infer<typeof todoItem>

export default function ProductLayout() {
  const [idParentChecklist, setIdParentChecklist] = useState<number>(0)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openAddItem, setOpenAddItem] = useState(false)
  const [openRenameItem, setOpenRenameItem] = useState(false)
  const [idChildChecklist, setIdChildChecklist] = useState<number>(0)
  const [idChildChecklistItem, setIdChildChecklistItem] = useState<number>(0)

  const [idItemPut, setIdItemPut] = useState<number>(0)
  const [idChildItemPut, setIdChildItemPut] = useState<number>(0)

  const idPut = useReactive(
    () => {
      return idItemPut
    },
    (newValue) => {
      setIdItemPut(newValue)
    }
  )

  const idChildPut = useReactive(
    () => {
      return idChildItemPut
    },
    (newValue) => {
      setIdChildItemPut(newValue)
    }
  )

  const idDelete = useReactive(
    () => {
      return idParentChecklist
    },
    (newValue) => {
      setIdParentChecklist(newValue)
    }
  )

  const idChildDelete = useReactive(
    () => {
      return idChildChecklistItem
    },
    (newValue) => {
      setIdChildChecklistItem(newValue)
    }
  )

  const formItem = useForm<TodoItemForm>({
    resolver: zodResolver(todoItem),
  })

  const idChildItem = useReactive(
    () => {
      return idChildChecklist
    },
    (newValue) => {
      setIdChildChecklist(newValue)
    }
  )

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoForm>({
    resolver: zodResolver(todoSchema),
  })

  // get
  const { data } = useApi<BaseResponse<{ data: Notes[] }>>({
    url: '/v1/checklist',
  })

  // delete
  const { mutate: actionDeleteChildItem } = useApi<null, { id: number }>({
    url: '/v1/checklist/' + idDelete.value + '/item/' + idChildDelete.value,
    method: 'DELETE',
    queryKey: ['/v1/checklist'],
  })
  const { mutate: actionDelete } = useApi<null, { id: number }>({
    url: '/v1/checklist/' + idDelete.value,
    method: 'DELETE',
  })
  function handleDelete(e: number) {
    idDelete.value = e
    actionDelete({
      id: idDelete.value,
    })
  }

  function handleDeleteChilditem(parent: number, child: number) {
    idChildDelete.value = parent
    idDelete.value = child
    actionDeleteChildItem({
      id: idChildDelete.value,
    })
  }

  // post
  const { mutate: actionPostTodo } = useApi<null, { itemName: string }>({
    url: '/v1/checklist/' + idChildItem.value + '/item',
    method: 'POST',
    queryKey: ['/v1/checklist'],
    onSuccess: () => {
      setOpenAddItem(false)
    },
  })

  //put
  const { mutate: actionPutTodo } = useApi<
    null,
    { itemCompletionStatus: boolean }
  >({
    url: '/v1/checklist/' + idPut.value + '/item/' + idChildPut.value,
    method: 'PUT',
    queryKey: ['/v1/checklist'],
    onSuccess: () => {
      setOpenAddItem(false)
    },
  })
  const { mutate: actionPutRename } = useApi<null, { itemName: string }>({
    url: '/v1/checklist/' + idPut.value + '/item/rename/' + idChildPut.value,
    method: 'PUT',
    queryKey: ['/v1/checklist'],
    onSuccess: () => {
      setOpenRenameItem(false)
    },
  })

  const { mutate: actionPost } = useApi<null, { name: string }>({
    url: '/v1/checklist',
    method: 'POST',
  })
  const handleAddTodo = useCallback(
    (e: TodoForm) => {
      actionPost({
        name: e.name,
      })
    },
    [actionPost]
  )

  const handleItem = useCallback((e: TodoItemForm) => {
    actionPostTodo({
      itemName: e.itemName,
    })
  }, [])

  const updateName = useCallback((e: TodoItemForm) => {
    actionPutRename({
      itemName: e.itemName,
    })
  }, [])

  function groupBySize(array: Item[], size: number): Item[][] {
    const result: Item[][] = []

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }

    return result
  }

  const getItem = useComputed(() => {
    const dataArray = data?.data ?? []
    return groupBySize(dataArray as Item[], 3) as Notes[][]
  })

  useEffect(() => {
    if (openAddModal || openAddItem || openRenameItem) {
      reset()
      formItem.reset()
    }
  }, [openAddModal, openAddItem, openRenameItem, reset, formItem])
  return (
    <div>
      <Modal
        title="Add Todo"
        open={openAddModal}
        setOpen={setOpenAddModal}
        contentText=""
      >
        <div className="my-3">
          <form onSubmit={handleSubmit(handleAddTodo)} noValidate>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Label Todo"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name')}
              />
            </Box>
            <Button variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        title="Add Item Todo"
        open={openAddItem}
        setOpen={setOpenAddItem}
        contentText=""
      >
        <div className="my-3">
          <form onSubmit={formItem.handleSubmit(handleItem)} noValidate>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Label Item Todo"
                error={!!formItem.formState.errors?.itemName}
                helperText={formItem.formState.errors?.itemName?.message}
                {...formItem.register('itemName')}
              />
            </Box>
            <Button variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        title="Update Item Todo"
        open={openRenameItem}
        setOpen={setOpenRenameItem}
        contentText=""
      >
        <div className="my-3">
          <form onSubmit={formItem.handleSubmit(updateName)} noValidate>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Label Item Todo"
                error={!!formItem.formState.errors?.itemName}
                helperText={formItem.formState.errors?.itemName?.message}
                {...formItem.register('itemName')}
              />
            </Box>
            <Button variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Modal>
      <div className="flex justify-between mb-5">
        <h2>Todo Apps</h2>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenAddModal(true)}
        >
          Add Todo
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ArrayMap
          of={getItem.value}
          render={(item, index) => (
            <div className="grid gap-4" key={index + 'parent'}>
              <ArrayMap
                of={item}
                render={(dataChecklist, i) => (
                  <div
                    key={i + 'child'}
                    className="border border-slate-300 p-3 rounded-lg min-h-[100px]"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>{dataChecklist.name}</div>
                      <div className="flex flex-row gap-2">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          className="!min-w-fit !h-fit"
                          onClick={() => {
                            idChildItem.value = dataChecklist.id

                            setOpenAddItem(true)
                          }}
                        >
                          <Plus width={16} height={16} />
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          className="!min-w-fit !h-fit"
                          onClick={() => handleDelete(dataChecklist.id)}
                        >
                          <X width={16} height={16} />
                        </Button>
                      </div>
                    </div>
                    <hr />
                    <If
                      condition={
                        !!(
                          dataChecklist.items && dataChecklist.items.length > 0
                        )
                      }
                    >
                      <ArrayMap
                        of={dataChecklist?.items || []}
                        render={(item, indChild) => (
                          <If key={indChild + 'child'} condition={!!item.name}>
                            <div
                              key={indChild + 'item'}
                              className="flex gap-2 items-center justify-between"
                            >
                              <div className="flex gap-2 items-center">
                                <Checkbox
                                  onChange={() => {
                                    idPut.value = dataChecklist?.id
                                    idChildPut.value = item.id
                                    actionPutTodo({
                                      itemCompletionStatus:
                                        !item.itemCompletionStatus,
                                    })
                                  }}
                                  checked={!!item.itemCompletionStatus}
                                />
                                <div>{item.name}</div>
                              </div>
                              <div className="gap-2 flex">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  className="!min-w-fit !h-fit"
                                  onClick={() => {
                                    idPut.value = dataChecklist?.id
                                    idChildPut.value = item.id
                                    setOpenRenameItem(true)
                                    formItem.setValue('itemName', item.name)

                                    // handleDeleteChilditem(
                                    //   item.id,
                                    //   dataChecklist.id
                                    // )
                                  }}
                                >
                                  <Pencil width={16} height={16} />
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  className="!min-w-fit !h-fit"
                                  onClick={() =>
                                    handleDeleteChilditem(
                                      item.id,
                                      dataChecklist.id
                                    )
                                  }
                                >
                                  <X width={16} height={16} />
                                </Button>
                              </div>
                            </div>
                          </If>
                        )}
                      />
                      <Else key={'else' + 'child'}>
                        <div className="flex items-center justify-center h-full pb-8">
                          No Item
                        </div>
                      </Else>
                    </If>
                    <div></div>
                  </div>
                )}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
