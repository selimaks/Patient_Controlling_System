import React, { Dispatch, MouseEvent, SetStateAction, ChangeEvent } from "react"
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
  Checkbox,
  Typography,
} from "@mui/material"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePickerEventFormData, ITodo } from "./EventCalendar"
import  tr  from 'date-fns/locale/tr'
interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  datePickerEventFormData: DatePickerEventFormData
  setDatePickerEventFormData: Dispatch<SetStateAction<DatePickerEventFormData>>
  onAddEvent: (e: MouseEvent<HTMLButtonElement>) => void
  todos: ITodo[]
}

const AddDatePickerEventModal = ({
  open,
  handleClose,
  datePickerEventFormData,
  setDatePickerEventFormData,
  onAddEvent,
  todos,
}: IProps) => {
  const { description, start, end, allDay } = datePickerEventFormData

  const onClose = () => {
    handleClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const isDisabled = () => {
    const checkend = () => {
      if (!allDay && end === null) {
        return true
      }
    }
    return description === "" || start === null || checkend();

  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Randevu Oluştur</DialogTitle>
      <DialogContent>
        <DialogContentText>Bilgileri Doldurun.</DialogContentText>
        <Box component="form">
          <TextField
            name="description"
            value={description}
            margin="dense"
            id="description"
            label="Hasta T.C. Kimlik No"
            type="text"
            fullWidth
            variant="filled"
            onChange={onChange}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <Box mb={2} mt={5}>
              <DateTimePicker
                label="Randevu Başlangıç Tarihi ve Saati"
                value={start}
                ampm={false}
                minutesStep={15}
                onChange={(newValue) =>
                  setDatePickerEventFormData((prevState) => ({
                    ...prevState,
                    start: new Date(newValue!),
                  }))
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

              {/*<Box>
              <Typography variant="caption" color="text" component={"span"}>
                All day?
              </Typography>
              <Checkbox onChange={handleCheckboxChange} value={allDay} />
            </Box>*/}

            <DateTimePicker
              label="Randevu Bitiş Tarihi ve Saati"
              disabled={allDay}
              minDate={start}
              minutesStep={15}
              ampm={false}
              value={allDay ? null : end}
              onChange={(newValue) =>
                setDatePickerEventFormData((prevState) => ({
                  ...prevState,
                  end: new Date(newValue!),
                }))
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={todos}
            sx={{ marginTop: 4 }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} variant='filled' label="İşlem" />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          İptal
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={onAddEvent}>
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddDatePickerEventModal
