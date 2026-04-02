export interface CardAction {
  icon: string
  severity?: 'secondary' | 'success' | 'danger' | 'info' | 'warn'
  outlined?: boolean
  label?: string
  visible?: boolean
  onClick: () => void
}

export interface CardBadge {
  label: string
  severity?: string
  icon?: string
}
