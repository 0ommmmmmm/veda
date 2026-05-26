import { motion } from 'framer-motion'
import { GeneratedQuestion, QuestionType } from '@/lib/types'
import { mockQuestions } from '@/lib/mock-data'

interface SectionBlockProps {
  questionType: QuestionType
  sectionNumber: number
  index?: number
  generatedQuestions?: GeneratedQuestion[]
}

const difficultyLevels = ['Easy', 'Moderate', 'Challenging']

export function SectionBlock({
  questionType,
  sectionNumber,
  index = 0,
  generatedQuestions,
}: SectionBlockProps) {
  const mockPool =
    mockQuestions[questionType.type as keyof typeof mockQuestions] || []

  const useBackendQuestions =
    generatedQuestions && generatedQuestions.length > 0

  const sectionVariants = {
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: index * 0.1 + i * 0.02, duration: 0.2, ease: 'easeOut' as const },
    }),
  }

  const questionCount = useBackendQuestions
    ? generatedQuestions.length
    : questionType.count

  return (
    <motion.div
      initial={false}
      animate="visible"
      variants={sectionVariants}
      className="bg-white rounded-xl border border-[#e5e7eb] p-8 mb-8 page-break break-inside-avoid opacity-100 visible"
    >
      <div className="text-center mb-8 pb-4 border-b border-[#e5e7eb]">
        <h2 className="text-xl font-bold text-[#111827]">
          Section {String.fromCharCode(64 + sectionNumber)}
        </h2>
        <p className="text-sm text-[#4b5563] mt-2">
          {questionCount} questions × {questionType.marksPerQuestion} marks each
        </p>
      </div>

      <div className="space-y-6">
        {useBackendQuestions
          ? generatedQuestions.map((gq) => (
              <div key={gq.id} className="break-inside-avoid">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111827] mb-2">
                      {gq.number}. {gq.text}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <motion.span
                        custom={0}
                        variants={badgeVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="text-xs bg-[#f3f4f6] text-[#374151] px-2 py-1 rounded"
                      >
                        [{gq.difficulty}]
                      </motion.span>
                      <motion.span
                        custom={1}
                        variants={badgeVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="text-xs bg-[#f3f4f6] text-[#374151] px-2 py-1 rounded"
                      >
                        [{gq.marks} Marks]
                      </motion.span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#e5e7eb] pt-3 ml-6">
                  {questionType.type === 'MCQ' && gq.options?.length ? (
                    <div className="space-y-2">
                      {gq.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-start gap-3">
                          <input
                            type="radio"
                            id={`${gq.id}-opt-${optIndex}`}
                            name={`question-${gq.id}`}
                            className="mt-1 accent-[#111827]"
                            disabled
                          />
                          <label
                            htmlFor={`${gq.id}-opt-${optIndex}`}
                            className="text-sm text-[#374151]"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AnswerLines questionType={questionType.type} />
                  )}
                </div>
              </div>
            ))
          : Array.from({ length: questionType.count }).map((_, qIndex) => {
              const question =
                mockPool[qIndex % mockPool.length] ||
                `Question ${qIndex + 1}`
              const difficulty =
                difficultyLevels[qIndex % difficultyLevels.length]
              return (
                <div key={qIndex} className="break-inside-avoid">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#111827] mb-2">
                        {qIndex + 1}. {question}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <motion.span
                          custom={0}
                          variants={badgeVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                          className="text-xs bg-[#f3f4f6] text-[#374151] px-2 py-1 rounded"
                        >
                          [{difficulty}]
                        </motion.span>
                        <motion.span
                          custom={1}
                          variants={badgeVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                          className="text-xs bg-[#f3f4f6] text-[#374151] px-2 py-1 rounded"
                        >
                          [{questionType.marksPerQuestion} Marks]
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#e5e7eb] pt-3 ml-6">
                    {questionType.type === 'MCQ' ? (
                      <div className="space-y-2">
                        {['A', 'B', 'C', 'D'].map((option) => (
                          <div key={option} className="flex items-start gap-3">
                            <input
                              type="radio"
                              id={`q${qIndex}-${option}`}
                              name={`question-${qIndex}`}
                              className="mt-1 accent-[#111827]"
                              disabled
                            />
                            <label
                              htmlFor={`q${qIndex}-${option}`}
                              className="text-sm text-[#374151]"
                            >
                              {option}. _________________
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <AnswerLines questionType={questionType.type} />
                    )}
                  </div>
                </div>
              )
            })}
      </div>
    </motion.div>
  )
}

function AnswerLines({ questionType }: { questionType: QuestionType['type'] }) {
  const lineClass = 'h-5 border-b border-[#9ca3af]'
  if (questionType === 'Short Answer') {
    return (
      <div className="space-y-2">
        <div className={lineClass} />
        <div className={lineClass} />
      </div>
    )
  }
  if (questionType === 'Essay') {
    return (
      <div className="space-y-2">
        <div className={lineClass} />
        <div className={lineClass} />
        <div className={lineClass} />
        <div className={lineClass} />
      </div>
    )
  }
  return (
    <div className="space-y-2">
      <div className={lineClass} />
      <div className={lineClass} />
    </div>
  )
}
