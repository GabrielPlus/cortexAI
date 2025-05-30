import { getUserAppointments } from '@/actions/appointment'
import { getUserClients } from '@/actions/dashboard'
import DashboardCard from '@/components/dashboard/cards'
import EmployeeBar from '@/components/employeebar'
import AddNewEployee from '@/components/employees'
import InfoBar from '@/components/inforbar'
import CalIcon from '@/icons/cal-icon'
import PersonIcon from '@/icons/person-icon'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {
  const clients = await getUserClients()
  const bookings = await getUserAppointments()
  return (
    <>
    <div className="px-5">
      
      </div>
      <div className="overflow-y-auto w-full chat-window flex-
      h-50">
        <AddNewEployee />
      </div>
    </>
  )
}

export default Page