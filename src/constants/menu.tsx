import CalIcon from '@/icons/cal-icon'
import ChatIcon from '@/icons/chat-icon'
import DashboardIcon from '@/icons/dashboard-icon'
import EmailIcon from '@/icons/email-icon'
import HelpDeskIcon from '@/icons/help-desk-icon'
import IntegrationsIcon from '@/icons/integrations-icon'
import PersonIcon from '@/icons/person-icon'
import SettingsIcon from '@/icons/settings-icon'
import StarIcon from '@/icons/star-icon'
import TimerIcon from '@/icons/timer-icon'
import { HandCoins, HandIcon, LayoutDashboardIcon } from 'lucide-react'

type SIDE_BAR_MENU_PROPS = {
  label: string
  icon: JSX.Element
  path: string
}

export const SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  {
    label: 'Bot Metrics',
    icon: <DashboardIcon />,
    path: 'dashboard',
  },
  {
    label: 'Attendance Metrics',
    icon: <LayoutDashboardIcon />,
    path: 'attendance-dashboard',
  },
  {
    label: 'Conversations',
    icon: <ChatIcon />,
    path: 'conversation',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: 'settings',
  },
    {
    label: 'Employees',
    icon: <PersonIcon/>,
    path: 'employees',
  },
    {
    label: 'Attendance',
    icon: <HandIcon />,
    path: 'attendance',
  },
  {
    label: 'Appointments',
    icon: <CalIcon />,
    path: 'appointment',
  },
]

type TABS_MENU_PROPS = {
  label: string
  icon?: JSX.Element
}

export const TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'All inbox',
    icon: <EmailIcon />,
  },
]

export const HELP_DESK_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'help desk',
  },
  {
    label: 'questions',
  },
]

export const APPOINTMENT_TABLE_HEADER = [
  'Name',
  'RequestedTime',
  'Added Time',
  'Domain',
]

export const EMAIL_MARKETING_HEADER = ['Id', 'Email', 'Answers', 'Domain']

export const BOT_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'Talk to Me',
    icon: <ChatIcon />,
  },
]