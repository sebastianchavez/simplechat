export enum STATES {
    SENDING = 'SENDING',
    SENT = 'SENT',
}

export interface Message {
    id: string;
    conversationId: string;
    from: string;
    to: string;
    message: string;
    date: number;
    state: STATES
}