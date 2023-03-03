import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:3002/seminarapi/",
  headers: {
    "Content-type": "application/json"
  }
});