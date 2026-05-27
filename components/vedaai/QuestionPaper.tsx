'use client'

import { useMemo, useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Assignment,
  Difficulty,
  GeneratedSection,
  QuestionPaper as QuestionPaperType,
  StudentInfo,
} from '@/lib/types'
import {
  sanitizeNodeForPdf,
  clearPdfExportMode,
} from '@/lib/pdfExport'
import { StudentInfoSection } from './StudentInfoSection'
import { SectionBlock } from './SectionBlock'
import { useSettingsStore } from '@/store/settings'

interface QuestionPaperProps {
  assignment: Assignment
  studentInfo: StudentInfo
  questionPaper?: QuestionPaperType
}

function buildFallbackSections(assignment: Assignment): GeneratedSection[] {
  const typesWithQuestions = assignment.questionTypes.filter((qt) => qt.count > 0)
  let sectionIndex = 0

  return typesWithQuestions.map((questionType) => {
    const sectionLabel = String.fromCharCode(65 + sectionIndex)
    sectionIndex += 1

    const questions = Array.from({ length: questionType.count }).map((_, index) => ({
      id: `${questionType.id}-${index}`,
      number: index + 1,
      text: `Sample ${questionType.type} question ${index + 1} for ${assignment.title}`,
      marks: questionType.marksPerQuestion,
      difficulty: (index % 3 === 0
        ? 'Easy'
        : index % 3 === 1
          ? 'Moderate'
          : 'Challenging') as Difficulty,
      ...(questionType.type.includes('MCQ')
        ? {
            options: [
              'A. Option A',
              'B. Option B',
              'C. Option C',
              'D. Option D',
            ],
          }
        : {}),
    }))

    return {
      sectionLabel,
      questionType,
      questions,
    }
  })
}

export function QuestionPaper({
  assignment,
  studentInfo,
  questionPaper,
}: QuestionPaperProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const settings = useSettingsStore((s) => s.settings)

  const totalQuestions =
    questionPaper?.totalQuestions ?? assignment.totalQuestions
  const totalMarks = questionPaper?.totalMarks ?? assignment.totalMarks
  const instructions =
    questionPaper?.instructions ?? assignment.instructions

  const backendSections = questionPaper?.sections ?? []
  const hasBackendSections = backendSections.length > 0

  const fallbackSections = useMemo(
    () => buildFallbackSections(assignment),
    [assignment]
  )

  const sectionsToRender = hasBackendSections ? backendSections : fallbackSections

  const handleDownloadPDF = async () => {
    const element = contentRef.current
    if (!element) return

    sanitizeNodeForPdf(element)

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        onclone: (clonedDoc) => {
          const cloned = clonedDoc.getElementById('printable-content')
          if (cloned instanceof HTMLElement) {
            sanitizeNodeForPdf(cloned, clonedDoc)
          }
        },
      })

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = 210
      const pageHeight = 297
      const margin = 5
      const imgWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgData = canvas.toDataURL('image/png', 1.0)

      let heightLeft = imgHeight
      let position = margin

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - margin * 2

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - margin * 2
      }

      pdf.save(`${assignment.title}-question-paper.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      clearPdfExportMode(element)
    }
  }

  const answerKeySections = sectionsToRender.map((s) => ({
    id: s.questionType.id,
    label: s.sectionLabel,
    count: s.questions.length,
  }))

  return (
    <div className="block w-full opacity-100 visible">
      <div className="sr-only">
        <button id="pdf-download-btn" type="button" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      <div
        ref={contentRef}
        className="block w-full opacity-100 visible bg-white text-[#111827]"
        id="printable-content"
      >
        <StudentInfoSection
          studentInfo={studentInfo}
          title={assignment.title}
          schoolName={
            assignment.schoolName ||
            settings.schoolName ||
            'School Name'
          }
          subjectLine={`Subject: ${
            assignment.subject || settings.subject || 'Subject'
          } | Class: ${
            assignment.className || (assignment as any).grade || (assignment as any).class || settings.className || 'Class'
          }`}
          assignmentTitle={questionPaper?.title ?? assignment.title}
          totalMarks={totalMarks}
          totalQuestions={totalQuestions}
          duration={studentInfo.duration}
        />

        <div className="bg-white rounded-lg border border-[#e5e7eb] p-6 mb-8 question-paper-summary">
          <h2 className="text-xl font-bold text-[#111827] mb-2">
            {questionPaper?.title ?? assignment.title}
          </h2>
          <p className="text-sm text-[#4b5563] mb-4">
            Total Questions:{' '}
            <span className="font-semibold text-[#111827]">{totalQuestions}</span>
            {' · '}
            Total Marks:{' '}
            <span className="font-semibold text-[#111827]">{totalMarks}</span>
          </p>
          {instructions && (
            <div>
              <h3 className="text-sm font-semibold text-[#111827] mb-2">Instructions</h3>
              <p className="text-sm text-[#374151] whitespace-pre-wrap">
                {instructions}
              </p>
            </div>
          )}
        </div>

        {sectionsToRender.map((section, index) => (
          <SectionBlock
            key={`${section.sectionLabel}-${section.questionType.id}`}
            questionType={section.questionType}
            sectionNumber={index + 1}
            index={index}
            generatedQuestions={section.questions}
          />
        ))}

        <div className="text-center py-8 mb-12 border-t-2 border-b-2 border-[#d1d5db]">
          <p className="text-sm font-semibold text-[#111827]">
            End of Question Paper
          </p>
        </div>

        <div className="bg-[#f9fafb] rounded-xl border border-[#e5e7eb] p-8 mt-12 print:break-before-page">
          <h3 className="text-lg font-bold text-[#111827] mb-6 pb-4 border-b border-[#d1d5db]">
            Answer Key
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {answerKeySections.map((section) => (
              <div key={section.id}>
                <p className="font-semibold text-[#111827] mb-3">
                  Section {section.label}
                </p>
                <div className="space-y-2 text-sm">
                  {Array.from({ length: section.count }).map((_, qIndex) => (
                    <p key={qIndex} className="text-[#374151]">
                      Q{qIndex + 1}: ______
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
