import IO                   from 'socket.io-client';
export const socket         = IO(config.domain.socket);