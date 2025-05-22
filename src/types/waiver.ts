export type Waiver = {
  id: string
  businessId: string
  templateId: string
  guestId: string
  fields: Record<string, any>
  signature: string
  signedAt: string
}