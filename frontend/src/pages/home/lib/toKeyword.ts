export function toKeyword(value: string | string[] | undefined): string {
	if (typeof value === "string") {
		return value.trim();
	}

	return "";
}
