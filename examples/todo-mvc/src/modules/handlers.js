import { map } from 'rxjs/operators/map'
import { createEvent, combineEpics } from 'stapp'
import { events } from './todo'

const handleSubmit = createEvent('Handle todo submit', event => event.target.value.trim())
const submitEpic = handleSubmit.epic((event$) => event$.pipe(
  map(({ payload }) => events.addTodo(payload))
))

const handleEdit = createEvent('Handle todo edit', (event, id) => ({
  text: event.target.value.trim(),
  id
}))
const editEpic = handleEdit.epic((event$) => event$.pipe(
  map(({ payload }) => events.editTodo(payload))
))

export const handlers = ({
  name: 'handlers',
  events: {
    handleSubmit,
    handleEdit,
    handleDblClick: events.toggleEditing,
    handleDeleteClick: events.deleteTodo,
    handleCheckboxClick: events.toggleComplete,
    handleClearClick: events.clearCompleted,
    handleToggleClick: () => events.toggleAll()
  },
  epic: combineEpics([
    submitEpic,
    editEpic
  ])
})
