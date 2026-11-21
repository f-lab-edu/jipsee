import type { ResolvingMetadata } from "next";
import { describe, expect, it } from "vitest";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";

const images = [{ url: "https://example.com/og.png" }];
const parent = Promise.resolve({
	openGraph: { images },
	twitter: { images },
}) as unknown as ResolvingMetadata;

describe("toPageMetadata", () => {
	it("path를 대표 주소와 og:url로 지정함", async () => {
		const metadata = await toPageMetadata(
			"이용약관",
			parent,
			"/policies/terms",
		);

		expect(metadata.alternates?.canonical).toBe("/policies/terms");
		expect(metadata.openGraph?.url).toBe("/policies/terms");
	});

	it("canonical이 false이면 대표 주소 없이 og:url만 지정함", async () => {
		const metadata = await toPageMetadata(
			"망원동 검색 결과",
			parent,
			"/search?keyword=%EB%A7%9D",
			{ canonical: false },
		);

		expect(metadata.alternates).toBeUndefined();
		expect(metadata.openGraph?.url).toBe("/search?keyword=%EB%A7%9D");
	});

	it("path가 없으면 대표 주소와 og:url을 지정하지 않음", async () => {
		const metadata = await toPageMetadata("이용약관", parent);

		expect(metadata.alternates).toBeUndefined();
		expect(metadata.openGraph?.url).toBeUndefined();
	});

	it("제목과 오픈 그래프 제목을 만들고 루트의 이미지를 다시 채움", async () => {
		const metadata = await toPageMetadata(
			"이용약관",
			parent,
			"/policies/terms",
		);

		expect(metadata.title).toBe("이용약관");
		expect(metadata.openGraph).toMatchObject({
			title: "이용약관 | 집씨",
			images,
		});
		expect(metadata.twitter).toMatchObject({ images });
	});
});
