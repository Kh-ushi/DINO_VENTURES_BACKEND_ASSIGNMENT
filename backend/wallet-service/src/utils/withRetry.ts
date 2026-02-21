import { logger } from "./logger";
export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3
): Promise<T> {
    let attempt = 0;

    while (true) {
        try {
            return await fn();
        } catch (err: any) {
            const isRetryable =
                err.code === "40001" || // serialization_failure
                err.code === "40P01";   // deadlock_detected

            if (!isRetryable || attempt >= retries) {
                throw err;
            }

            attempt++;
            logger.warn(
                { attempt},
                "Retrying transaction due to DB conflict"
            );
        }
    }
}