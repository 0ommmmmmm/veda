import { StudentInfo } from '@/lib/types'

interface StudentInfoSectionProps {
  studentInfo: StudentInfo
  title: string
  schoolName?: string
  subjectLine?: string
  duration?: string
  totalMarks?: number
  totalQuestions?: number
  assignmentTitle?: string
}

export function StudentInfoSection({
  studentInfo,
  title,
  schoolName = 'Delhi Public School, Sector-4, Bokaro',
  subjectLine = 'Subject: English | Class: 5th',
  duration = '2 hours',
  totalMarks,
  totalQuestions,
  assignmentTitle,
}: StudentInfoSectionProps) {
  const displayTitle = assignmentTitle ?? title
  const marks = totalMarks ?? 20
  const questions = totalQuestions

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 mb-8 question-paper-header">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">{schoolName}</h1>
        <p className="text-sm text-[#4b5563]">{subjectLine}</p>
        <p className="text-lg font-semibold text-[#111827] mt-4">{displayTitle}</p>
      </div>

      <div className="flex justify-between mb-8 pb-8 border-b border-[#e5e7eb]">
        <div>
          <p className="text-xs text-[#4b5563]">Time Allowed</p>
          <p className="text-lg font-semibold text-[#111827]">{duration}</p>
        </div>
        <div className="text-center">
          {questions !== undefined && (
            <>
              <p className="text-xs text-[#4b5563]">Total Questions</p>
              <p className="text-lg font-semibold text-[#111827]">{questions}</p>
            </>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-[#4b5563]">Maximum Marks</p>
          <p className="text-lg font-semibold text-[#111827]">{marks}</p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-[#374151]">
          Answer all questions as per the instructions given. Write clearly and
          legibly.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm">
          <span className="font-medium text-[#111827]">Name:</span>
          <span className="ml-24 border-b border-[#111827] inline-block w-48">______</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-[#111827]">Roll Number:</span>
          <span className="ml-12 border-b border-[#111827] inline-block w-48">______</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-[#111827]">Class:</span>
          <span className="ml-12 border-b border-[#111827] inline-block w-48">
            {studentInfo.className || '______'}
          </span>
        </p>
      </div>
    </div>
  )
}
