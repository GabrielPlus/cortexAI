'use client'
import React from 'react'


// const WelcomeMessage = dynamic(
//   () => import('./greetings-message').then((props) => props.default),
//   {
//     ssr: false,
//   }
// )

type Props = {
  id: string
  name: string
  plan: 'STANDARD' |'ULTIMATE' | 'PRO'
  chatBot: {
    id: string
    icon: string | null
    welcomeMessage: string | null
  } | null
}

const SettingsForm = ({ id, name, chatBot, plan }: Props) => {

    return <div>settingsform</div>
}

export default SettingsForm