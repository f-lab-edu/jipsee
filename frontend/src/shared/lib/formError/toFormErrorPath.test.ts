import { describe, expect, it } from "vitest";
import { toFormErrorPath } from "@/shared/lib/formError/toFormErrorPath";

describe("toFormErrorPath", () => {
	it("경로 뒤에 error 쿼리로 코드를 붙여 반환함", () => {
		expect(toFormErrorPath("/me", "logout-failed")).toBe(
			"/me?error=logout-failed",
		);
	});
});
