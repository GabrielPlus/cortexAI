'use client'
import { useHelpDesk } from '@/hooks/settings/use-settings'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import Section from '@/components/section-label'
import FormGenerator from '../form-generator'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/loader'
import Accordion from '@/components/accordian'
import { Separator } from '@/components/ui/separator'

type Props = {
  id: string
}

const HelpDesk = ({ id }: Props) => {
  const {
    register,
    errors,
    onSubmitQuestion,
    onEditQuestion,
    isQuestions,
    loading,
    onCancelEdit,
    setValue
  } = useHelpDesk(id)

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)

  const handleEditClick = (questionId: string) => {
    setEditingQuestionId(questionId)
    onEditQuestion(questionId)
  }

  const handleCancelEdit = () => {
    setEditingQuestionId(null)
    onCancelEdit()
  }

  return (
    <Card className="w-full grid grid-cols-1 lg:grid-cols-2">
      <CardContent className="p-6 border-r-[1px]">
        <CardTitle>Help Desk</CardTitle>
        <form onSubmit={onSubmitQuestion} className="flex flex-col gap-6 mt-10">
          <div className="flex flex-col gap-3">
            <Section
              label="Question"
              message="Add a frequently asked question"
            />
            <FormGenerator
              inputType="input"
              register={register}
              errors={errors}
              form="help-desk-form"
              name="question"
              placeholder="Type your question"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Section
              label="Answer to question"
              message="The answer for the question"
            />
            <FormGenerator
              inputType="textarea"
              register={register}
              errors={errors}
              name="answer"
              form="help-desk-form"
              placeholder="Type your answer"
              type="text"
              lines={5}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-orange hover:bg-orange hover:opacity-70 transition duration-150 ease-in-out text-white font-semibold"
            >
              Create
            </Button>
          </div>
        </form>
      </CardContent>
      <CardContent className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
        <Loader loading={loading}>
          {isQuestions.length ? (
            <div className="space-y-4 pr-2">
              {isQuestions.map((question) => (
                <div key={question.id} className="mb-4">
                  {editingQuestionId === question.id ? (
                    <div className="p-4 border rounded-lg">
                      <FormGenerator
                        inputType="textarea"
                        type="text"
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setValue('question', e.target.value)
                        }
                        lines={3}
                        className="mb-3"
                        register={register}
                        name="question"
                        errors={errors}
                      />
                      <div className="mt-4">
                        <FormGenerator
                          inputType="textarea"
                          type="text"
                          placeholder="Enter your answer"
                          value={question.answer}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            setValue('answer', e.target.value)
                          }
                          lines={3}
                          className="mb-3"
                          register={register}
                          name="answer"
                          errors={errors}
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => onSubmitQuestion()}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Accordion
                        trigger={question.question}
                        content={question.answer}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleEditClick(question.id)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          ) : (
            <CardDescription>No Questions to show</CardDescription>
          )}
        </Loader>
      </CardContent>
    </Card>
  )
}

export default HelpDesk