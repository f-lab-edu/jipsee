import { HStack, Text } from "@seed-design/react";
import Link from "next/link";
import { footerLinks } from "@/widgets/footer/config/footerLinks";

export default function Footer() {
	return (
		<footer>
			<HStack gap="x4" px="spacingX.globalGutter" py="x6">
				{footerLinks.map((link) => (
					<Link key={link.href} href={link.href}>
						<Text fontSize="t3" color="fg.neutralSubtle">
							{link.label}
						</Text>
					</Link>
				))}
			</HStack>
		</footer>
	);
}
