export type AudienceTab = "schools" | "students"

export interface ValuePropItem {
  id: string
  title: string
  description: string
  metric: string
  metricLabel: string
  badge: string
  iconName: string
}

export interface SimulatorQuestionOption {
  id: string
  label: string
  text: string
}

export interface SimulatorQuestion {
  id: string
  subject: string
  examType: string
  questionText: string
  options: SimulatorQuestionOption[]
  correctOptionId: string
  explanation: string
}

export interface FeatureCardItem {
  id: string
  title: string
  description: string
  badge: string
  iconName: string
  highlight?: boolean
}

export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role: string
  organization: string
  badgeText: string
  rating: number
}
