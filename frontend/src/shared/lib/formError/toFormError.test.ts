import { describe, expect, it } from "vitest";
import { toFormError } from "@/shared/lib/formError/toFormError";

describe("toFormError", () => {
	it("허용한 코드이면 그 코드를 반환함", () => {
		expect(toFormError("logout-failed", ["logout-failed"])).toBe(
			"logout-failed",
		);
	});

	it("다른 화면의 코드이면 null을 반환함", () => {
		expect(toFormError("chat-delete-failed", ["logout-failed"])).toBeNull();
	});

	it.each([undefined, "", "unknown", ["logout-failed"]])(
		"%s이면 null을 반환함",
		(value) => {
			expect(toFormError(value, ["logout-failed"])).toBeNull();
		},
	);
});
