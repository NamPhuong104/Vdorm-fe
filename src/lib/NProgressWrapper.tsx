"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

const NProgressWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar height="2px" color="#d71e35" options={{ showSpinner: false }} shallowRouting />
    </>
  )
}

export default NProgressWrapper
