import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  value: number
  icon: JSX.Element
  sales?: boolean
}

const DashboardCard = ({ icon, title, value, sales }: Props) => {
  return (
    <div className={cn(
      "rounded-lg flex flex-col gap-3 p-6 md:p-8 border bg-card text-card-foreground",
      "transition-colors duration-200" // Smooth theme transition
    )}>
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <h2 className="font-bold text-lg text-muted-foreground">
          {title}
        </h2>
      </div>
      <p className="font-bold text-3xl md:text-4xl">
        {sales && '$'}
        {value}
      </p>
    </div>
  )
}

export default DashboardCard