import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChatPanelDesktop from "@/features/askChatbot/ui/ChatPanelDesktop";

describe("ChatPanelDesktop", () => {
	it("세션이 없으면 /login으로 가는 로그인하고 이용하기 링크를 표시함", () => {
		render(<ChatPanelDesktop session={null} />);

		expect(
			screen.getByRole("link", { name: "로그인하고 이용하기" }),
		).toHaveProperty("pathname", "/login");
	});

	it("세션이 있으면 로그인하고 이용하기 링크를 표시하지 않음", () => {
		render(<ChatPanelDesktop session={{ provider: "GOOGLE" }} />);

		expect(screen.queryByText("로그인하고 이용하기")).toBeNull();
	});
});
