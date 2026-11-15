export type StatusKind = "notFound" | "error" | "rateLimited";

/** 다시 시도할 수 있는 상태. 404는 다시 시도해도 같아서 제외함 */
export type RetryableStatusKind = Exclude<StatusKind, "notFound">;
