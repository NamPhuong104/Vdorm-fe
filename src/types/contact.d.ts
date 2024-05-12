export {}

declare global {
  interface IContact {
    _id: string
    fullName: string
    email: string
    phone: string
    content: string
    status: string
    replyContent?: string 
  }

  interface IContacts {
    statusCode?: number
    message?: string
    data: {
      metadata?: {
        current?: number
        pageSize?: number
        pages?: number
        total?: number
      }
      result: IContact[]
    }
  }
}
