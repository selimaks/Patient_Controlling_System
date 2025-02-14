import { useState, Dispatch, SetStateAction } from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { router } from '@inertiajs/react';
import { HexColorPicker } from "react-colorful"
import { ITodo, generateId } from "./EventCalendar"
import {toast} from "react-toastify";

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  todos: ITodo[]
  setTodos: Dispatch<SetStateAction<ITodo[]>>
}

export const AddTodoModal = ({ open, handleClose, todos, setTodos }: IProps) => {
  const [color, setColor] = useState("#b32aa9")
  const [title, setTitle] = useState("")

    const onAddTodo = () => {
        const newTodo = {
            _id: generateId(),
            color,
            title,
        };

        setTitle("");

        setTodos([...todos, newTodo]);

        router.put('/operations/createOperation', newTodo, {
            onSuccess: (page: any) => {
                console.log("Operasyon Eklendi: ", title);
                const message = page?.props?.flash?.message || "Operasyon Eklendi!";
                toast.success(message);
            },
            onError: (errors: any) => {
                const errorMessage = errors?.props?.flash?.message || "Hata: Operasyon eklenemedi!";
                toast.error(errorMessage);
                console.log("Operasyon Eklenemedi!: ", title);
            }
        });
    };

    const onDeletetodo = (_id: string) => {
        setTodos(todos.filter((todo) => todo._id !== _id));
        const id: number = +_id;
        console.log(id);
        router.put("operations/deleteOperations/", {id}, {
            onSuccess: (page: any) => {
                console.log("Operasyon Silindi: ", title);
                const message = page?.props?.flash?.message || "Operasyon Silindi!";
                toast.success(message);
            },
            onError: (errors: any) => {
                const errorMessage = errors?.props?.flash?.message || "Hata: Operasyon silinemedi!";
                toast.error(errorMessage);
                console.log("Operasyon Silinemedi!: ", title);
            }
        });

    }

  const onClose = () => handleClose()

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>İşlem Ekle</DialogTitle>
      <DialogContent>
        <DialogContentText>Önceden kaydetmek istediğiniz işlemleri bu ekranda kaydedebilirsiniz. (Örn. Diş Çekimi/Kontrol/Kanal Tedavisi)</DialogContentText>
        <Box>
          <TextField
            name="title"
            autoFocus
            margin="dense"
            id="title"
            label="İşlem"
            type="text"
            fullWidth
            sx={{ mb: 6 }}
            required
            variant="filled"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            value={title}
          />
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <HexColorPicker color={color} onChange={setColor} />
            <Box sx={{ height: 80, width: 80, borderRadius: 1 }} className="value" style={{ backgroundColor: color }}></Box>
          </Box>
          <Box>
            <List sx={{ marginTop: 3 }}>
              {todos.map((todo) => (
                <ListItem
                  key={todo.title}
                  secondaryAction={
                    <IconButton onClick={() => onDeletetodo(todo._id)} color="error" edge="end">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Box
                    sx={{ height: 40, width: 40, borderRadius: 1, marginRight: 1 }}
                    className="value"
                    style={{ backgroundColor: todo.color }}
                  ></Box>
                  <ListItemText primary={todo.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ marginTop: 2 }}>
        <Button sx={{ marginRight: 2 }} variant="contained" color="error" onClick={onClose}>
          Kapat
        </Button>
        <Button
          onClick={() => onAddTodo()}
          disabled={title === "" || color === ""}
          sx={{ marginRight: 2 }}
          variant="contained"
          color="success"
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  )
}
