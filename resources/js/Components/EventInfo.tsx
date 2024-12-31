import { Typography } from "@mui/material"
import { IEventInfo } from "./EventCalendar"

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography>{event.patient_name}</Typography>
    </>
  )
}

export default EventInfo
