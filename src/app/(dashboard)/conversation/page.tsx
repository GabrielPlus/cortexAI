export const dynamic = 'force-dynamic'

import { onGetAllAccountDomains } from '@/actions/settings'
import ConversationMenu from '@/components/conversations'
import Messenger from '@/components/conversations/messenger'
import InfoBar from '@/components/inforbar'
import { Separator } from '@/components/ui/separator'
import React from 'react'

type Props = {}

const ConversationPage = async (props: Props) => {
  try {
    const domains = await onGetAllAccountDomains()
    
    return (
      <div className="w-full h-full flex">
        <ConversationMenu domains={domains?.domains || []} />
        <Separator orientation="vertical" />
        <div className="w-full flex flex-col">
          <div className="px-5">
            <InfoBar />
          </div>
          <Messenger />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading conversation page:", error)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Failed to load conversations. Please try again later.</p>
      </div>
    )
  }
}

export default ConversationPage

// export const dynamic = 'force-dynamic'


// import { onGetAllAccountDomains } from '@/actions/settings'
// import ConversationMenu from '@/components/conversations'
// import Messenger from '@/components/conversations/messenger'
// // import Messenger from '@/components/conversations/messenger'
// import InfoBar from '@/components/inforbar'
// import { Separator } from '@/components/ui/separator'
// import React from 'react'

// type Props = {}

// const ConversationPage = async (props: Props) => {
//   const domains = await onGetAllAccountDomains()
//   return (
//     <div className="w-full h-full flex">
//       <ConversationMenu domains={domains?.domains} />

//       <Separator orientation="vertical" />
//       <div className="w-full flex flex-col">
//         <div className="px-5">
//           <InfoBar />
//         </div>
//         <Messenger />
//       </div>
//     </div>
//   )
// }

// export default ConversationPage