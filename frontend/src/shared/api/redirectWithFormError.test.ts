import { describe, expect, it } from "vitest";
import { redirectWithFormError } from "@/shared/api/redirectWithFormError";

describe("redirectWithFormError", () => {
	it("본문 없이 경로에 error 쿼리를 붙인 Location으로 303을 반환함", async () => {
		const response = redirectWithFormError("/chat/2", "chat-delete-failed");

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe(
			"/chat/2?error=chat-delete-failed",
		);
		expect(await response.text()).toBe("");
	});
});
