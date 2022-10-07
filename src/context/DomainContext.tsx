import { ReactNode, createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

type DomainProviderProps = {
  children: ReactNode
}

export type DomainContextProps = {
  domain: string
  record: string
  isUpdatingRecords: boolean
  isSuccessfulUpdate: boolean
  setDomain: Dispatch<SetStateAction<string>>
  setRecord: Dispatch<SetStateAction<string>>
  setIsUpdatingRecords: Dispatch<SetStateAction<boolean>>
  setIsSuccessfulUpdate: Dispatch<SetStateAction<boolean>>
  clearForm: () => void
  editRecord: (domain: string, record: string) => void
}

const DomainContext = createContext<DomainContextProps>({} as DomainContextProps)

// 1. context custom hook
export function useDomainContext() {
  return useContext(DomainContext)
}

// Create a provider and render out children for provider
export function DomainProvider({ children }: DomainProviderProps) {
  const [domain, setDomain] = useState<string>('')
  const [record, setRecord] = useState<string>('')
  const [isUpdatingRecords, setIsUpdatingRecords] = useState<boolean>(false)
  const [isSuccessfulUpdate, setIsSuccessfulUpdate] = useState<boolean>(false)

  // Clear the form inputs
  const clearForm = () => {
    setDomain('')
    setRecord('')
    setIsUpdatingRecords(false)
  }

  const editRecord = (domain: string, record: string) => {
    setIsUpdatingRecords(true)
    setDomain(domain)
    setRecord(record)
  }

  const value = {
    domain,
    record,
    setDomain,
    setRecord,
    clearForm,
    isUpdatingRecords,
    setIsUpdatingRecords,
    editRecord,
    isSuccessfulUpdate,
    setIsSuccessfulUpdate,
  }

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>
}
