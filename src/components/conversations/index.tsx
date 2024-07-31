import React from 'react'

type Props = {
    domains?:
    | {
        name: string
        id: string
        icon: string
    }[]
    | undefined
}

const ConversationMenu = ({ domains }: Props) => {
  return (
    <div>ConversationMenu</div>
  )
}

export default ConversationMenu