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
      <DialogTitle>Randevu Bilgileri</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography sx={{ fontSize: 14, marginTop: 3 }} color="text.secondary" gutterBottom>
            {currentEvent?.description}
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
