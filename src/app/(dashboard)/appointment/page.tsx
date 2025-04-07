export const dynamic = 'force-dynamic'

import { onGetAllBookingsForCurrentUser } from '@/actions/appointment'
import AllAppointments from '@/components/appointment/all-appointments'
import InfoBar from '@/components/inforbar'
import Section from '@/components/section-label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { currentUser } from '@clerk/nextjs'
import React from 'react'

// Date utility functions
const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime())
}

const safeGetDate = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null
  if (date instanceof Date) return isValidDate(date) ? date : null
  
  const parsed = new Date(date)
  return isValidDate(parsed) ? parsed : null
}

const formatTime = (date: Date | null) => {
  if (!date) return "N/A"
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`
}

type Props = {}

const Page = async (props: Props) => {
  try {
    const user = await currentUser()
    if (!user) return null

    const domainBookings = await onGetAllBookingsForCurrentUser(user.id)
    const today = new Date()

    if (!domainBookings) {
      return (
        <div className="w-full flex justify-center">
          <p>No Appointments</p>
        </div>
      )
    }

    const bookingsExistToday = domainBookings.bookings.filter(booking => {
      const bookingDate = safeGetDate(booking.date)
      return bookingDate?.getDate() === today.getDate() && 
             bookingDate?.getMonth() === today.getMonth() && 
             bookingDate?.getFullYear() === today.getFullYear()
    })

    return (
      <>
        <InfoBar />
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 h-0 gap-5">
          <div className="lg:col-span-2 overflow-y-auto">
            <AllAppointments bookings={domainBookings.bookings} />
          </div>
          <div className="col-span-1">
            <Section
              label="Bookings For Today"
              message="All your bookings for today are mentioned below."
            />
            {bookingsExistToday.length ? (
              bookingsExistToday.map((booking) => (
                <Card
                  key={booking.id}
                  className="rounded-xl overflow-hidden mt-4"
                >
                  <CardContent className="p-0 flex">
                    <div className="w-4/12 text-xl bg-peach py-10 flex justify-center items-center font-bold">
                      {booking.slot}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between w-full p-3">
                        <p className="text-sm">
                          created
                          <br />
                          {formatTime(safeGetDate(booking.createdAt))}
                        </p>
                        <p className="text-sm">
                          Domain <br />
                          {booking.Customer?.Domain?.name || 'N/A'}
                        </p>
                      </div>
                      <Separator orientation="horizontal" />
                      <div className="w-full flex items-center p-3 gap-2">
                        <Avatar>
                          <AvatarFallback>{booking.email?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">{booking.email || 'No email'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="w-full flex justify-center">
                <p>No Appointments For Today</p>
              </div>
            )}
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error("Error loading appointments:", error)
    return (
      <div className="w-full flex justify-center">
        <p>Failed to load appointments. Please try again later.</p>
      </div>
    )
  }
}

export default Page

// export const dynamic = 'force-dynamic'


// import { onGetAllBookingsForCurrentUser } from '@/actions/appointment'
// import AllAppointments from '@/components/appointment/all-appointments'
// import InfoBar from '@/components/inforbar'
// import Section from '@/components/section-label'
// import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import { Card, CardContent } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
// import { currentUser } from '@clerk/nextjs'
// import React from 'react'

// type Props = {}

// const Page = async (props: Props) => {
//   const user = await currentUser()

//   if (!user) return null
//   const domainBookings = await onGetAllBookingsForCurrentUser(user.id)
//   const today = new Date()

//   if (!domainBookings)
//     return (
//       <div className="w-full flex justify-center">
//         <p>No Appointments</p>
//       </div>
//     )

//   const bookingsExistToday = domainBookings.bookings.filter(
//     (booking) => booking.date.getDate() === today.getDate()
//   )

//   return (
//     <>
//       <InfoBar />
//       <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 h-0 gap-5">
//         <div className="lg:col-span-2 overflow-y-auto">
//           <AllAppointments bookings={domainBookings?.bookings} />
//         </div>
//         <div className="col-span-1">
//           <Section
//             label="Bookings For Today"
//             message="All your bookings for today are mentioned below."
//           />
//           {bookingsExistToday.length ? (
//             bookingsExistToday.map((booking) => (
//               <Card
//                 key={booking.id}
//                 className="rounded-xl overflow-hidden mt-4"
//               >
//                 <CardContent className="p-0 flex">
//                   <div className="w-4/12 text-xl bg-peach py-10 flex justify-center items-center font-bold">
//                     {booking.slot}
//                   </div>
//                   <div className="flex flex-col flex-1">
//                     <div className="flex justify-between w-full p-3">
//                       <p className="text-sm">
//                         created
//                         <br />
//                         {booking.createdAt.getHours()}{' '}
//                         {booking.createdAt.getMinutes()}{' '}
//                         {booking.createdAt.getHours() > 12 ? 'PM' : 'AM'}
//                       </p>
//                       <p className="text-sm">
//                         Domain <br />
//                         {booking.Customer?.Domain?.name}
//                       </p>
//                     </div>
//                     <Separator orientation="horizontal" />
//                     <div className="w-full flex items-center p-3 gap-2">
//                       <Avatar>
//                         <AvatarFallback>{booking.email[0]}</AvatarFallback>
//                       </Avatar>
//                       <p className="text-sm">{booking.email}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <div className="w-full flex justify-center">
//               <p>No Appointments For Today</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default Page