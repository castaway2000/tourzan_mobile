import { UPDATE_BOOKING } from "../actions/actionTypes";
import moment from "moment";

const initialState = {
  bookingdata: {
    isTripInProgress: false,
    isAutomatic: true,
    timeLimit: 0, //second //5 hour
    bookedTime: moment().format("YYYY-MM-DD H:mm:ss"), //yyyy-MM-dd HH:mm:ss
    remainingTime: 0, //second
    tripid: 0
  }
};

const update = (state, action) => {
  let bd = action.bookingdata;

  if (bd.bookedTime) {
    const today = moment();

    const bookedTime = moment(bd.bookedTime, "YYYY-MM-DD H:mm:ss");

    const diff = today.diff(bookedTime, "second");

    bd.remainingTime = bd.timeLimit - diff;

    console.log("bookedTime", bookedTime.format("YYYY-MM-DD H:mm:ss"));
    console.log("today", today.format("YYYY-MM-DD H:mm:ss"));

    console.log("diff", diff);
    console.log("timeLimit", bd.timeLimit);
    console.log("remainingTime", bd.remainingTime);
    console.log("----------------------------------------------------------");
  }

  return { ...state, bookingdata: Object.assign({}, bd) };
};

const tourReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BOOKING:
      return update(state, action);
    default:
      return state;
  }
};

export default tourReducer;
