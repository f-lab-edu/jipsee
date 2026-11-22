import type { ResolvingMetadata } from "next";
import { describe, expect, it } from "vitest";
import { toHomeMetadata } from "@/shared/lib/metadata/toHomeMetadata";

const images = [{ url: "https://example.com/og.png" }];
const parent = Promise.resolve({
	openGraph: { images },
	twitter: { images },
}) as unknown as ResolvingMetadata;

describe("toHomeMetadata", () => {
	it("대표 주소와 og:url을 홈 경로로 지정함", async () => {
		const metadata = await toHomeMetadata(parent);

		expect(metadata.alternates?.canonical).toBe("/");
		expect(metadata.openGraph?.url).toBe("/");
	});

	it("제목은 루트 기본값을 쓰고 오픈 그래프 제목은 집씨이며 이미지를 다시 채움", async () => {
		const metadata = await toHomeMetadata(parent);

		expect(metadata).not.toHaveProperty("title");
		expect(metadata.openGraph).toMatchObject({ title: "집씨", images });
	});
});
