import { useChatContext } from '@/context/user-chat-context'
import { ConversationSearchSchema } from '@/schemas/conversation.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useConversation = () => {
    const { register, watch } = useForm({
        resolver: zodResolver(ConversationSearchSchema),
        mode: 'onChange',
      })
      const { setLoading: loadMessages, setChats, setChatRoom } = useChatContext()
}