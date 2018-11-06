import { UPDATE_BOOKING } from "./actionTypes";

const updatebooking = bookingdata => {
  return {
    type: UPDATE_BOOKING,
    bookingdata: bookingdata
  };
};

export { updatebooking };
