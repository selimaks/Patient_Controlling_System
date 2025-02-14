import React, { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from "react"
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Autocomplete,
  Box,
} from "@mui/material"
import { EventFormData, ITodo } from "./EventCalendar"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  eventFormData: EventFormData
  setEventFormData: Dispatch<SetStateAction<EventFormData>>
  onAddEvent: (e: MouseEvent<HTMLButtonElement>) => void
  todos: ITodo[]
}

const AddEventModal = ({ open, handleClose, eventFormData, setEventFormData, onAddEvent, todos }: IProps) => {
  const { patient_name } = eventFormData

  const onClose = () => handleClose()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Randevu Oluştur</DialogTitle>
      <DialogContent>
        <DialogContentText>Bilgileri doldurun</DialogContentText>
        <Box component="form">
            <TextField
                name="patient_name"
                value={patient_name}
                margin="dense"
                id="patient_name"
                label="Hasta Adı"
                type="text"
                fullWidth
                variant="filled"
                onChange={onChange}
            />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={todos}
            sx={{ marginTop: 4 }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (<TextField {...params} variant='filled' label="İşlem" />)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          İptal
        </Button>
        <Button disabled={patient_name === ""} color="success" onClick={onAddEvent}>
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventModal
