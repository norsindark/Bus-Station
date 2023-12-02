import { Alert, Checkbox, FormControl, FormControlLabel, MenuItem, Modal, Select, TextField, Tooltip } from "@mui/material"
import ArgonBox from "components/ArgonBox"
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";
import ArgonTypography from "components/ArgonTypography"
import { useEffect, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import { createTrip } from "services/trip";
import { getProvinces } from "services/trip";
import { editTrip } from "services/trip";
import { deleteTrip } from "services/trip";
import { getCurrentDate } from "utils/getCurrentDate";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const initialFormData = {
    price: "",
    provinceEnd: "_",
    provinceStart: "_",
    timeStart: getCurrentDate()
};

const TripFormModal = ({ trip, open, handleClose, refresh, mode }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState("")
    const [formSuccess, setFormSuccess] = useState(false)

    const [provinces, setProvinces] = useState([])

    useEffect(() => {
        if (trip) {
            const { price, provinceStart, provinceEnd, timeStart } = trip
            setFormData({
                price,
                provinceEnd,
                provinceStart,
                timeStart
            })
        }
    }, [trip])

    useEffect(() => {
        (async () => {
            const provincesData = await getProvinces()
            setProvinces(provincesData)
        })()
    }, [])

    const handleCopyToClipboard = async () => {
        await navigator.clipboard.writeText(trip.tripId);
    };

    const onHandleClose = () => {
        setFormError("")
        setFormSuccess(false)
        setFormData(initialFormData)
        handleClose()
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handlePriceChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: Number(value),
        }));
    }

    const handleTimeChange = val => {
        setFormData(prevS => ({
            ...prevS,
            timeStart: val["$d"]
        }))
    }

    const handleDelete = async () => {
        try {
            await deleteTrip(trip.tripId)

            setFormError("")
            setFormSuccess(true)
            setFormData(initialFormData)

            await refresh()
        } catch (error) {
            setFormSuccess(false)
            setFormError("Update information failed. Please check and try again !")
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const date = new Date(formData.timeStart)
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const timeStart = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const payload = {
                ...formData,
                timeStart

            }

            if (!trip) {
                await createTrip(payload)
            }

            if (trip) {
                await editTrip(trip.tripId, payload)
            }

            setFormError("")
            setFormSuccess(true)
            setFormData(initialFormData)

            await refresh()
        } catch (error) {
            setFormSuccess(false)
            setFormError("Update information failed. Please check and try again !")
        }
    };

    return (
        <Modal
            open={open}
            onClose={onHandleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ArgonBox sx={style}>
                <ArgonTypography id="modal-modal-title" variant="h6" component="h2">
                    {trip ? "Edit information" : "New trip"}
                </ArgonTypography>
                <form onSubmit={handleSubmit}>
                    <FormControl
                        variant="outlined"
                        fullWidth
                        sx={{
                            my: 1,
                            '& .MuiInputBase-formControl, & .MuiSelect-select': { display: "block !important", margin: 0, width: "100% !important" },
                        }}

                    >
                        <Select
                            value={formData.provinceStart}
                            onChange={handleInputChange}
                            name="provinceStart"
                            label="Province start"
                            required
                            sx={{ width: "100%" }}
                            disabled={mode === "VIEW"}
                        >
                            <MenuItem value="_" disabled>
                                Select start point*
                            </MenuItem>
                            {provinces.map((option) => (
                                <MenuItem key={option.provinceId} value={option.location[0].name}>
                                    {option.location[0].name} - {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl
                        variant="outlined"
                        fullWidth
                        margin="8px"
                        sx={{
                            '& .MuiInputBase-formControl, & .MuiSelect-select': { display: "block !important", margin: 0, width: "100% !important" },
                        }}

                    >
                        <Select
                            value={formData.provinceEnd}
                            onChange={handleInputChange}
                            name="provinceEnd"
                            label="Province end"
                            required
                            sx={{ width: "100%" }}
                            disabled={mode === "VIEW"}
                        >
                            <MenuItem value="_" disabled>
                                Select end point*
                            </MenuItem>
                            {provinces.map((option) => (
                                <MenuItem key={option.provinceId} value={option.location[0].name}>
                                    {option.location[0].name} - {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <ArgonInput
                        name="price"
                        placeholder="Price*"
                        value={formData.price}
                        onChange={handlePriceChange}
                        sx={{ my: 1 }}
                        type="number"
                        required
                        disabled={mode === "VIEW"}
                        fullWidth
                    />
                    <DatePicker
                        sx={{ mb: 1 }}
                        value={dayjs(formData.timeStart)}
                        disabled={mode === "VIEW"}
                        onChange={handleTimeChange}
                    />
                    <TimePicker
                        sx={{ mb: 1, ml: "4px" }}
                        value={dayjs(formData.timeStart)}
                        disabled={mode === "VIEW"}
                        onChange={handleTimeChange}

                    />

                    {formSuccess && <ArgonBox sx={{ my: 2 }}> <Alert severity="success">Success</Alert> </ArgonBox>}
                    {formError && <ArgonBox sx={{ my: 2 }}> <Alert severity="error">Action failed</Alert> </ArgonBox>}

                    <ArgonBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ArgonButton type="submit" variant="contained" color="primary">
                            {trip ? "Update" : "Create"}
                        </ArgonButton>
                        {trip && trip.status
                            && (
                                <ArgonButton type="button" variant="outlined" color="error" onClick={handleDelete}>
                                    Disable
                                </ArgonButton>
                            )
                        }
                    </ArgonBox>
                </form>
            </ArgonBox>
        </Modal>
    )
}

export default TripFormModal