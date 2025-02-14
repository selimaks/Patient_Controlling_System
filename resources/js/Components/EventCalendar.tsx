import { useState, MouseEvent, useEffect } from "react"
import {router, usePage} from '@inertiajs/react';
import { Box, Button, ButtonGroup, Card, CardContent, Container, Divider } from "@mui/material"
import "../../css/app.css"

import { Calendar, type Event, dateFnsLocalizer } from "react-big-calendar"

import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import { tr } from 'date-fns/locale'

import "react-big-calendar/lib/css/react-big-calendar.css"

import EventInfo from "./EventInfo"
import EventInfoModal from "./EventInfoModal"
import { AddTodoModal } from "./AddTodoModal"
import {toast} from "react-toastify";

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
    operation: string
  description: string
  todoId: string
}

export interface EventFormData {
    patient_name: string
  description: string
    doctor_name: string
    status: string
    notes: string
    operation: string
  todoId: string
}

export interface DatePickerEventFormData {
    patient_name: string
  description: string
    doctor_name: string
    status: string
    notes: string
    operation: string
  todoId: string
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
    operation: "",
    todoId: "",
}

const initialDatePickerEventFormData: DatePickerEventFormData = {
    patient_name: "",
  description: "",
    doctor_name: "",
    status: "",
    notes: "",
    operation: "",
  todoId: "",
  allDay: false,
  start: undefined,
  end: undefined,
}
interface Operation{
    id: string;
    color: string;
    operation: string;
    created_by: string;
}

const EventCalendar = () => {

    const appointments  = usePage().props.appointments as any;
    const operations = usePage().props.operations as Operation[];
  const [openTodoModal, setOpenTodoModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null)

  const [eventInfoModal, setEventInfoModal] = useState(false)

  const [events, setEvents] = useState<IEventInfo[]>([])
  const [todos, setTodos] = useState<ITodo[]>([])

  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

  const handleSelectSlot = (event: Event) => {
    setCurrentEvent(event)
  }

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event)
    setEventInfoModal(true)
  }

  const handleClose = () => {
    setEventFormData(initialEventFormState)
  }

  const handleDatePickerClose = () => {
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }

    useEffect(() => {
        if (operations) {
            const operationDB = operations.map((operations: Operation) => ({
                _id: operations.id,
                title: operations.operation,
                color: operations.color,
            }))
            setTodos(operationDB);
        }
    }, []);

    useEffect(() => {
        if (appointments) {
            // Veriyi dönüştürerek takvim formatına uyarlıyoruz
            const appointmentEvents = appointments.map((appointment: any) => {
                const relatedOperation = operations?.find((op: Operation) => op.operation === appointment.operation);

                return {
                    _id: appointment.id.toString(),
                    title: `Randevu - ${appointment.patient_id}`,
                    operation: `${appointment.operation}`,
                    notes: `${appointment.notes}`,
                    doctor_name: `${appointment.doctor_name}`,
                    patient_name: `${appointment.patient_name}`,
                    start: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`),
                    end: new Date(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 60 * 60 * 1000),
                    todoId: relatedOperation ? relatedOperation.id : null, // Eğer eşleşen operasyon varsa ID'yi ata, yoksa null bırak
                };
            });
            setEvents(appointmentEvents); // Çevrilen veriyi takvime ekliyoruz
        }
    }, [appointments]);

  const onDeleteEvent = () => {
      if (!currentEvent || !(currentEvent as IEventInfo)._id) {
          toast.error("Hata: Silinecek randevu bulunamadı!");
          return;
      }
    setEvents(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
    setEventInfoModal(false)
      router.put('/appointments/delete', { _id: (currentEvent as IEventInfo)._id }, {
          onSuccess: (page: any) => {
              console.log('Randevu Silindi:');
              toast.success(page.props.flash?.message || "Randevu Oluşuturuldu");
          },
          onError: (errors: any) => {
              toast.error(errors?.message || "Hata: Randevu oluşturulamadı!");
              console.log('Randevu Oluşturulamadı');
          }
      });
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
                  {/*<Button onClick={() => setOpenDatepickerModal(true)} size="small" variant="contained">
                      Randevu Oluştur
                  </Button>*/}
                <Button onClick={() => setOpenTodoModal(true)} size="small" variant="contained">
                  İşlem Ekle
                </Button>
              </ButtonGroup>
            </Box>
            <Divider style={{ margin: 10 }} />
              {/*<AddEventModal
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
            />*/}
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
