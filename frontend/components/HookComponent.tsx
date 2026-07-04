import { useReducer } from 'react'

interface State {
  previous: string
  current: string
  message: string
  url: string
  hint: string
}

type Action =
  | { type: 'UPDATE_CURRENT'; payload: string }
  | { type: 'UPDATE_PREVIOUS'; payload: string }
  | { type: 'UPDATE_HINT'; payload: string }
  | { type: 'UPDATE_URL'; payload: string }

const initialState: State = {
  previous: 'Hello World!',
  current: 'it is so',
  message: 'Get started now.',
  url: 'https://tailwindcss.com/docs',
  hint: 'you are not',
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_CURRENT':
      return { ...state, current: action.payload }
    case 'UPDATE_PREVIOUS':
      return { ...state, previous: action.payload }
    case 'UPDATE_HINT':
      return { ...state, hint: action.payload }
    case 'UPDATE_URL':
      return { ...state, url: action.payload }
    default:
      return state
  }
}

export default function HookComponent() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { previous, current, message, url, hint } = state

  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{message}</h1>
      <p className="text-gray-600">{hint}</p>

      <dl className="grid grid-cols-2 gap-2 text-sm text-gray-700">
        <dt className="font-semibold">Previous</dt>
        <dd>{previous}</dd>
        <dt className="font-semibold">Current</dt>
        <dd>{current}</dd>
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          className="btn-secondary"
          onClick={() => dispatch({ type: 'UPDATE_PREVIOUS', payload: current })}
        >
          Save current as previous
        </button>
        <button
          className="btn-secondary"
          onClick={() => dispatch({ type: 'UPDATE_CURRENT', payload: 'I am the wind!' })}
        >
          Update current
        </button>
        <button
          className="btn-secondary"
          onClick={() => dispatch({ type: 'UPDATE_HINT', payload: 'you are the storm' })}
        >
          Update hint
        </button>
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'UPDATE_URL', payload: 'https://tailwindcss.com/docs' })}
        >
          Get Started
        </button>
      </div>

      <p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center font-bold text-earth-600 hover:text-earth-700"
        >
          {url}
        </a>
      </p>
    </div>
  )
}
