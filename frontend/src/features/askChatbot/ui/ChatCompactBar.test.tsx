import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatCompactBar from "@/features/askChatbot/ui/ChatCompactBar";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("ChatCompactBar", () => {
	it("세션이 없으면 로그인하고 이용하기 링크를 입력 상자 밖 아래 줄에 표시함", () => {
		render(<ChatCompactBar session={null} />);

		const input = screen.getByRole("textbox", { name: "집사에게 질문" });
		const link = screen.getByRole("link", { name: "로그인하고 이용하기" });

		expect(input.parentElement?.contains(link)).toBe(false);
		expect(
			input.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});
});
