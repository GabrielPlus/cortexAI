import { getUserAppointments } from '@/actions/appointment'
import { getUserClients } from '@/actions/dashboard'
import DashboardCard from '@/components/dashboard/cards'
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
      <InfoBar />
      </div>
      <div className="overflow-y-auto w-full chat-window flex-
      h-50">
        <div className="flex flex-col gap-5 w-fit">
          <DashboardCard
            value={clients || 0}
            title="Potential Visitors"
            icon={<PersonIcon />}
          />
          <DashboardCard
            value={bookings || 0}
            title="Appointments"
            icon={<CalIcon />}
          />
        </div>
      </div>
    </>
  )
}

export default Page