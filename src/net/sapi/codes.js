
export const code_1 = ( message ) => {return { ERR: message, CODE: -1 }}
export const code_0 = ( ACK , SIGNAL, PAYLOAD ) => {
  return { ACK, SIGNAL, CODE: 0, PAYLOAD }
}
/**
   * the code_0 object is the response object: it does not gaurante the request 
   * as ```completly acknowledged```` eg reading from a file (see signals 
   * instead). it only specifies the request was recieved and processed succefully.
*/