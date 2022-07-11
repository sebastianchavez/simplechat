export enum STATES {
    SENDING = 'SENDING',
    SENT = 'SENT',
}

export interface IMessage {
    id: string;
    conversationId: string;
    from: string;
    to: string;
    message: string;
    date: Date;
    state: STATES
    appId: string;
}

export interface IQueryMessages {
    page: number;
    limit: number;
    appId: string;
    conversationId: string;
}