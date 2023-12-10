export interface JwtPayload {
    username: string;
    sub: number; // Or string, based on the type of your user ID
}
