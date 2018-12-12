import axios from 'axios';
var instance = axios.create({
  baseURL: `http://${process.env.HOST||'0.0.0.0'}:${process.env.PORT||3000}`,
  timeout:2000,
  headers:{

  }
})

export default instance
