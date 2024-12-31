import { useState, MouseEvent, useEffect } from "react"
import { usePage } from '@inertiajs/react';
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Divider } from "@mui/material"
import "../../css/app.css"

import { Calendar, type Event, dateFnsLocalizer } from "react-big-calendar"

import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import { tr } from 'date-fns/locale'

import "react-big-calendar/lib/css/react-big-calendar.css"

import EventInfo from "./EventInfo"
import AddEventModal from "./AddEventModal"
import EventInfoModal from "./EventInfoModal"
import { AddTodoModal } from "./AddTodoModal"
import AddDatePickerEventModal from "./AddDatePickerEventModal"

const locales = {
  tr : tr,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export interface ITodo {
  _id: string
  title: string
  color?: string
}

export interface IEventInfo extends Event {
  _id: string
    patient_name: string
    doctor_name: string
    status: string
    notes: string
  description: string
  todoId?: string
}

export interface EventFormData {
    patient_name: string
  description: string
    doctor_name: string
    status: string
    notes: string
  todoId?: string
}

export interface DatePickerEventFormData {
    patient_name: string
  description: string
    doctor_name: string
    status: string
    notes: string
  todoId?: string
  allDay: boolean
  start?: Date
  end?: Date
}

export const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString()

const initialEventFormState: EventFormData = {
    patient_name: "", // Doğru isimlendirme
    description: "",
    doctor_name: "",
    status: "",
    notes: "",
    todoId: undefined,
}

const initialDatePickerEventFormData: DatePickerEventFormData = {
    patient_name: "",
  description: "",
    doctor_name: "",
    status: "",
    notes: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  end: undefined,
}

const EventCalendar = () => {

    const appointments  = usePage().props.appointments as any;
  const [openSlot, setOpenSlot] = useState(false)
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false)
  const [openTodoModal, setOpenTodoModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null)

  const [eventInfoModal, setEventInfoModal] = useState(false)

  const [events, setEvents] = useState<IEventInfo[]>([])
  const [todos, setTodos] = useState<ITodo[]>([])

  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

  const handleSelectSlot = (event: Event) => {
    setOpenSlot(true)
    setCurrentEvent(event)
  }

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event)
    setEventInfoModal(true)
  }

  const handleClose = () => {
    setEventFormData(initialEventFormState)
    setOpenSlot(false)
  }

  const handleDatePickerClose = () => {
    setDatePickerEventFormData(initialDatePickerEventFormData)
    setOpenDatepickerModal(false)
  }

  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data: IEventInfo = {
      ...eventFormData,
      _id: generateId(),
      start: currentEvent?.start,
      end: currentEvent?.end,
    }

    const newEvents = [...events, data] //Burda yeni event ekleniyor.

    setEvents(newEvents)
    handleClose()
  }

    useEffect(() => {
        if (appointments) {
            // Veriyi dönüştürerek takvim formatına uyarlıyoruz
            const appointmentEvents = appointments.map((appointment: any) => ({
                _id: appointment.id.toString(), // Takvim için benzersiz ID
                title: `Randevu - ${appointment.patient_id}`, // Başlık
                description: `${appointment.notes}`, // Açıklama
                doctor_name: `${appointment.doctor_name}`,
                patient_name: `${appointment.patient_name}`,
                start: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`), // Başlangıç zamanı
                end: new Date(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 60 * 60 * 1000), // Bitiş zamanı (örnek olarak aynı zamanda)
                todoId: undefined, // Opsiyonel todoId
            }));
            setEvents(appointmentEvents); // Çevrilen veriyi takvime ekliyoruz
        }
    }, [appointments]);

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined
    }

    const setMinToZero = (date: any) => {
      date.setSeconds(0)

      return date
    }

    const data: IEventInfo = {
      ...datePickerEventFormData,
      _id: generateId(),
      start: setMinToZero(datePickerEventFormData.start),
      end: datePickerEventFormData.allDay
        ? addHours(datePickerEventFormData.start, 12)
        : setMinToZero(datePickerEventFormData.end),
    }

    const newEvents = [...events, data]

    setEvents(newEvents)
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }

  const onDeleteEvent = () => {
    setEvents(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
    setEventInfoModal(false)
  }

  return (
    <Box
      mt={-10}
      mb={2}
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonGroup size="large" variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => setOpenDatepickerModal(true)} size="small" variant="contained">
                  Randevu Oluştur
                </Button>
                <Button onClick={() => setOpenTodoModal(true)} size="small" variant="contained">
                  İşlem Ekle
                </Button>
              </ButtonGroup>
            </Box>
            <Divider style={{ margin: 10 }} />
            <AddEventModal
              open={openSlot}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              todos={todos}
            />
            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
            />
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => setEventInfoModal(false)}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent as IEventInfo}
            />
            <AddTodoModal
              open={openTodoModal}
              handleClose={() => setOpenTodoModal(false)}
              todos={todos}
              setTodos={setTodos}
            />
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="start"
              components={{ event: EventInfo }}
              endAccessor="end"
              defaultView="month"
              culture="tr"
              eventPropGetter={(event) => {
                const hasTodo = todos.find((todo) => todo._id === event.todoId)
                return {
                  style: {
                    backgroundColor: hasTodo ? hasTodo.color : "#b64fc8",
                    borderColor: hasTodo ? hasTodo.color : "#b64fc8",
                  },
                }
              }}
              style={{
                height: 500,
              }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default EventCalendar
