import { io } from 'socket.io-client';

const baseUrl = 'localhost:8000';

export const socket = io(baseUrl, {
    path: "/ss",
    autoConnect: false,
})