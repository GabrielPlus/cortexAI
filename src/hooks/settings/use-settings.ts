import { onChatBotImageUpdate, onDeleteUserDomain, onUpdateDomain, onUpdateWelcomeMessage } from '@/actions/settings'
import { useToast } from '@/components/ui/use-toast'
import { DomainSettingsProps, DomainSettingsSchema } from '@/schemas/settings.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadClient } from '@uploadcare/upload-client'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'


const upload = new UploadClient({
    publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
  })

export const useThemeMode = () => {

    const { setTheme, theme } = useTheme()
    return {
        setTheme,
        theme,
    }
}

export const useSettings = (id: string) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<DomainSettingsProps>({
      resolver: zodResolver(DomainSettingsSchema),
    })
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)
    const [deleting, setDeleting] = useState<boolean>(false)
    const onUpdateSettings = handleSubmit(async (values) => {
        setLoading(true)
        if (values.domain) {
            const domain = await onUpdateDomain(id, values.domain)
            if (domain) {
                toast({
                  title: 'Success',
                  description: domain.message,
                })
              }
        }
        if (values.image[0]) {
            const uploaded = await upload.uploadFile(values.image[0])
            const image = await onChatBotImageUpdate(id, uploaded.uuid)
            if (image) {
                toast({
                  title: image.status == 200 ? 'Success' : 'Error',
                  description: image.message,
                })
                setLoading(false)
              }
          }
          if (values.welcomeMessage) {
            const message = await onUpdateWelcomeMessage(values.welcomeMessage, id)
            if (message) {
              toast({
                title: 'Success',
                description: message.message,
              })
            }
          }
          reset()
          router.refresh()
          setLoading(false)
    })

    const onDeleteDomain = async () => {
        setDeleting(true)
        const deleted = await onDeleteUserDomain(id)
        if (deleted) {
          toast({
            title: 'Success',
            description: deleted.message,
          })
          setDeleting(false)
          router.refresh()
        }
      }
      return {
        register,
        onUpdateSettings,
        errors,
        loading,
        onDeleteDomain,
        deleting,
      }
    }