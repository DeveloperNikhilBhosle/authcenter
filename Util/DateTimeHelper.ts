import { Injectable } from "@nestjs/common";

@Injectable()
export class DateTimeHelper {
    static async getPgAdminUtcTimestamp() {
        const now = new Date();

        const pad = (num: number, size = 2) => num.toString().padStart(size, '0');

        // Date parts
        const year = now.getUTCFullYear();
        const month = pad(now.getUTCMonth() + 1);
        const day = pad(now.getUTCDate());

        // Time parts
        const hours = pad(now.getUTCHours());
        const minutes = pad(now.getUTCMinutes());
        const seconds = pad(now.getUTCSeconds());

        // Milliseconds to microseconds (3 extra zeros)
        const milliseconds = now.getUTCMilliseconds();
        const microseconds = (milliseconds * 1000).toString().padStart(6, '0');

        // UTC offset always +00:00 for UTC
        const offset = '+00:00';

        // Compose final string
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds} ${offset}`;
    }
}