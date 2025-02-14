import { SetStateAction, MouseEvent, Dispatch } from "react"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box, Typography } from "@mui/material"
import { IEventInfo } from "./EventCalendar"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo | null
}

const EventInfoModal = ({ open, handleClose, onDeleteEvent, currentEvent }: IProps) => {
  const onClose = () => {
    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Hasta Adı: {currentEvent?.patient_name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
            <Typography sx={{ fontSize: 16, marginTop: 3 }} color="text.primary" gutterBottom>
                Tarih: {currentEvent?.appointment_date}
            </Typography>
            <Typography sx={{ fontSize: 16, marginTop: 3 }} color="text.primary" gutterBottom>
                Saat: {currentEvent?.appointment_time}
            </Typography>
          <Typography sx={{ fontSize: 16, marginTop: 3 }} color="text.primary" gutterBottom>
             Doktor: {currentEvent?.doctor_name}
          </Typography>
          <Typography sx={{ fontSize: 16, marginTop: 3 }} color="text.primary" gutterBottom>
            Operasyon: {currentEvent?.operation}
          </Typography>
            <Typography sx={{ fontSize: 16, marginTop: 1 }} color="text.primary" gutterBottom>
            Not: {currentEvent?.notes}
          </Typography>
        </DialogContentText>
        <Box component="form"></Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Kapat
        </Button>
        <Button color="info" onClick={onDeleteEvent}>
          Randevuyu Sil
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventInfoModal
