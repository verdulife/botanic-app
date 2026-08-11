import React from "react";
import { Sequence } from "remotion";
import { FONT_FAMILY, COLORS } from "../brand";
import { MeshBackground, type MeshVariant } from "../mesh";

export interface CatalogSlot {
	id: string;
	label: string;
	frames: number;
	mesh?: MeshVariant;
	element?: React.ReactNode;
}

const RADIUS = "0.625rem";

const labelPill: React.CSSProperties = {
	position: "absolute",
	top: 28,
	left: 28,
	zIndex: 20,
	display: "flex",
	alignItems: "center",
	gap: 10,
	fontFamily: FONT_FAMILY,
	fontSize: 22,
	fontWeight: 600,
	letterSpacing: "normal",
	color: COLORS["still-900"],
	background: COLORS["linen-100"],
	borderRadius: RADIUS,
	padding: "10px 18px",
};

const EmptySlot: React.FC<{ label: string; mesh: MeshVariant }> = ({ label, mesh }) => {
	return (
		<div style={{ position: "absolute", inset: 0 }}>
			<MeshBackground variant={mesh} />
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 16,
					padding: 48,
				}}
			>
				<span
					style={{
						fontFamily: FONT_FAMILY,
						fontSize: 46,
						fontWeight: 600,
						letterSpacing: "normal",
						color: COLORS["still-900"],
						textAlign: "center",
					}}
				>
					{label}
				</span>
				<span
					style={{
						fontFamily: FONT_FAMILY,
						fontSize: 24,
						fontWeight: 400,
						letterSpacing: "normal",
						color: COLORS["linen-700"],
						textAlign: "center",
					}}
				>
					vacío — dime qué componente usar
				</span>
			</div>
		</div>
	);
};

export const Catalog: React.FC<{ slots: CatalogSlot[] }> = ({ slots }) => {
	let cursor = 0;
	return (
		<>
			{slots.map((slot) => {
				const from = cursor;
				cursor += slot.frames;
				return (
					<Sequence
						key={slot.id}
						from={from}
						durationInFrames={slot.frames}
						name={slot.label}
					>
						{slot.element ?? <EmptySlot label={slot.label} mesh={slot.mesh ?? "minimal"} />}
						<div style={labelPill}>{slot.label}</div>
					</Sequence>
				);
			})}
		</>
	);
};
