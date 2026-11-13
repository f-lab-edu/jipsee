import { describe, expect, it } from "vitest";
import { toDeleteRedirectPath } from "@/pages/chat/lib/toDeleteRedirectPath";

const origin = "http://localhost:3000";

describe("toDeleteRedirectPath", () => {
	it("열려 있던 대화가 삭제한 대화가 아니면 그 대화 경로를 반환함", () => {
		expect(toDeleteRedirectPath(`${origin}/chat/2`, 1)).toBe("/chat/2");
	});

	it("새 대화 화면에서 삭제하면 /chat을 반환함", () => {
		expect(toDeleteRedirectPath(`${origin}/chat`, 1)).toBe("/chat");
	});

	it("열려 있던 대화를 삭제하면 /chat을 반환함", () => {
		expect(toDeleteRedirectPath(`${origin}/chat/1`, 1)).toBe("/chat");
	});

	it("대화 목록 화면에서 삭제하면 /chat/history를 반환함", () => {
		expect(toDeleteRedirectPath(`${origin}/chat/history`, 1)).toBe(
			"/chat/history",
		);
	});

	it.each([null, "", "not a url", `${origin}/me`])(
		"%s이면 /chat/history를 반환함",
		(referer) => {
			expect(toDeleteRedirectPath(referer, 1)).toBe("/chat/history");
		},
	);
});
