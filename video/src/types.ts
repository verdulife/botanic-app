export type MotionStyle = "energy" | "cozy" | "minimal";

export type SceneType = "hook" | "tip" | "cover" | "slide" | "quote" | "outro" | "cta";

export interface Scene {
	type: SceneType;
	text: string;
	media?: string;
	duration: number;
	cta?: string;
	logo?: boolean;
	button?: string;
}

export interface Script {
	title: string;
	style: MotionStyle;
	template: string;
	duration?: number;
	platform: Array<"ig" | "tiktok">;
	scenes: Scene[];
}
