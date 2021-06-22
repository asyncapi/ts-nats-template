export interface GeneralReply {
    status_code?: number;
    status_message?: string;
    additionalProperties?: object | string | number | Array<unknown> | boolean | null | number;
}
