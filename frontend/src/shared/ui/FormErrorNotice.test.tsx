import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import FormErrorNotice from "@/shared/ui/FormErrorNotice";

describe("FormErrorNotice", () => {
	afterEach(() => {
		window.history.replaceState(null, "", "/");
	});

	it.each([
		["logout-failed", "로그아웃하지 못했어요. 다시 시도해 주세요"],
		["withdraw-failed", "탈퇴하지 못했어요. 다시 시도해 주세요"],
		["chat-delete-failed", "대화를 삭제하지 못했어요. 다시 시도해 주세요"],
	] as const)("%s이면 알림 띠에 문구를 출력함", (code, text) => {
		render(<FormErrorNotice code={code} />);

		expect(screen.getByRole("alert").textContent).toBe(text);
	});

	it("주소에서 error 쿼리만 지우고 나머지 쿼리는 남김", () => {
		window.history.replaceState(
			null,
			"",
			"/chat?buildingId=3&error=chat-delete-failed",
		);

		render(<FormErrorNotice code="chat-delete-failed" />);

		expect(window.location.pathname + window.location.search).toBe(
			"/chat?buildingId=3",
		);
	});
});
