import axios from "axios";


export const approveRequest = (requestId, accessToken) => axios.patch(`http://localhost:3001/requests/${requestId}`, {
  state: 'APPROVED'
}, {
  headers: {
    authorization: `Bearer ${accessToken}`
  }
})

export const denyRequest = (requestId, accessToken) => axios.patch(`http://localhost:3001/requests/${requestId}`, {
  state: 'DENIED'
}, {
  headers: {
    authorization: `Bearer ${accessToken}`
  }
})