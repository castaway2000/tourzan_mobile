import { UPDATE_CURRENT_LOCATION } from "./actionTypes";

const updatelocation = locationdata => {
  return {
    type: UPDATE_CURRENT_LOCATION,
    currentlocation: locationdata
  };
};

export { updatelocation };
