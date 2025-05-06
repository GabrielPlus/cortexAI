import { onChatBotImageUpdate, onDeleteHelpDeskQuestion, onCreateFilterQuestions, onUpdateHelpDeskQuestion, onCreateHelpDeskQuestion, onDeleteUserDomain, onGetAllFilterQuestions, onGetAllHelpDeskQuestions, onUpdateDomain, onUpdateWelcomeMessage } from '@/actions/settings'
import { useToast } from '@/components/ui/use-toast'
import { DomainSettingsProps, DomainSettingsSchema, FilterQuestionsProps, FilterQuestionsSchema, HelpDeskQuestionsProps, HelpDeskQuestionsSchema } from '@/schemas/settings.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadClient } from '@uploadcare/upload-client'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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

export const useHelpDesk = (id: string) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<HelpDeskQuestionsProps>({
    resolver: zodResolver(HelpDeskQuestionsSchema),
  });
  
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isQuestions, setIsQuestions] = useState<
    { id: string; question: string; answer: string }[]
  >([]);

  // Handle both create and update
  const onSubmitQuestion = handleSubmit(async (values) => {
    setLoading(true);
    if (editingId) {
      // Update existing question
      const result = await onUpdateHelpDeskQuestion(
        editingId,
        values.question,
        values.answer
      );
      if (result && result.question) {
        setIsQuestions(isQuestions.map(q => 
          q.id === editingId ? result.question! : q
        ));
        toast({
          title: result.status === 200 ? 'Success' : 'Error',
          description: result.message,
        });
        setEditingId(null);
      }
    } else {
      // Create new question
      const question = await onCreateHelpDeskQuestion(
        id,
        values.question,
        values.answer
      );
      if (question && question.questions) {
        setIsQuestions([...isQuestions, ...question.questions]);
        toast({
          title: question.status === 200 ? 'Success' : 'Error',
          description: question.message,
        });
      }
    }
    reset();
    setLoading(false);
  });

  // Delete a question
  const onDeleteQuestion = async (questionId: string) => {
    setDeletingId(questionId);
    try {
      const result = await onDeleteHelpDeskQuestion(questionId);
      if (result) {
        if (result.status === 200) {
          setIsQuestions(isQuestions.filter(q => q.id !== questionId));
          toast({
            title: 'Success',
            description: result.message,
          });
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Prepare form for editing
  const onEditQuestion = (questionId: string) => {
    const question = isQuestions.find(q => q.id === questionId);
    if (question) {
      setValue('question', question.question);
      setValue('answer', question.answer);
      setEditingId(questionId);
    }
  };

  // Cancel editing mode
  const onCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  // Fetch all questions
  const onGetQuestions = async () => {
    setLoading(true);
    const questions = await onGetAllHelpDeskQuestions(id);
    if (questions && questions.questions) {
      setIsQuestions(questions.questions);
      setLoading(false);
    }
  };

  useEffect(() => {
    onGetQuestions();
  }, []);

  return {
    register,
    onSubmitQuestion,
    errors,
    isQuestions,
    loading,
    deletingId,
    editingId,
    onEditQuestion,
    onCancelEdit,
    onDeleteQuestion,
    setValue,
  };
};

export const useFilterQuestions = (id: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FilterQuestionsProps>({
    resolver: zodResolver(FilterQuestionsSchema),
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [isQuestions, setIsQuestions] = useState<
    { id: string; question: string }[]
  >([])

  const onAddFilterQuestions = handleSubmit(async (values) => {
    setLoading(true)
    const questions = await onCreateFilterQuestions(id, values.question)
    if (questions) {
      setIsQuestions(questions.questions!)
      toast({
        title: questions.status == 200 ? 'Success' : 'Error',
        description: questions.message,
      })
      reset()
      setLoading(false)
    }
  })

  const onGetQuestions = async () => {
    setLoading(true)
    const questions = await onGetAllFilterQuestions(id)
    if (questions) {
      setIsQuestions(questions.questions)
      setLoading(false)
    }
  }

  useEffect(() => {
    onGetQuestions()
  }, [])

  return {
    loading,
    onAddFilterQuestions,
    register,
    errors,
    isQuestions,
  }

} 