import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatPanelDesktop from "@/features/askChatbot/ui/ChatPanelDesktop";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("ChatPanelDesktop", () => {
	it("세션이 없으면 /login으로 가는 로그인하고 이용하기 링크를 표시함", () => {
		render(<ChatPanelDesktop session={null} />);

		expect(
			screen.getByRole("link", { name: "로그인하고 이용하기" }),
		).toHaveProperty("pathname", "/login");
	});

	it("세션이 있으면 /chat으로 가는 지난 대화 링크와 질문 입력을 표시하고 로그인하고 이용하기 링크는 표시하지 않음", () => {
		render(<ChatPanelDesktop session={{ provider: "GOOGLE" }} />);

		expect(screen.getByRole("link", { name: "지난 대화" })).toHaveProperty(
			"pathname",
			"/chat",
		);
		expect(screen.getByRole("textbox", { name: "집사에게 질문" })).toBeTruthy();
		expect(screen.queryByText("로그인하고 이용하기")).toBeNull();
	});
});
