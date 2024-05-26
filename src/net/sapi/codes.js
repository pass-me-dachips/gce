export const code_1 = (message) => {
  return { error: message, code: -1 };
};
export const code_0 = (ack, sig, oid, payload) => {
  return { ack, sig, oid, CODE: 0, payload };
};
/**
 * the code_0 object is the response object: it does not gaurante the request
 * as ```completly acknowledged```` eg reading from a file (see signals
 * instead). it only specifies the request was recieved and processed succefully.
 */
