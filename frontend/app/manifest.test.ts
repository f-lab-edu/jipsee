// @vitest-environment node
import { describe, expect, it } from "vitest";
import { siteMetadata } from "@/shared/config/siteMetadata";
import manifest from "./manifest";

describe("웹 앱 매니페스트", () => {
	it("이름, 설명, 시작 경로, 표시 방식, 색, 언어를 정해진 값으로 반환함", () => {
		expect(manifest()).toMatchObject({
			name: "집씨",
			short_name: "집씨",
			description: siteMetadata.description,
			start_url: "/",
			display: "standalone",
			background_color: "#ffffff",
			theme_color: "#217CF9",
			lang: "ko",
		});
	});

	it("아이콘은 192, 512 일반과 512 마스커블 PNG 세 개임", () => {
		expect(manifest().icons).toEqual([
			{
				src: "/icons/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-maskable-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		]);
	});
});
