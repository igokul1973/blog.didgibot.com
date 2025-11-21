export enum DataSourceErrorsEnum {
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    NETWORK_ERROR = 'NETWORK_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    SERVER_ERROR = 'SERVER_ERROR',
    UNKNOWN = 'UNKNOWN'
}

export interface IDataSourceError {
    type: DataSourceErrorsEnum;
    message: string;
    page?: number;
    originalError?: unknown;
}
