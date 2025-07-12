export interface Notes {
  id: number
  name: string
  items?: Item[]
  checklistCompletionStatus: boolean
}

export interface Item {
  id: number
  name: string
  itemCompletionStatus: boolean
}
