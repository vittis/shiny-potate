export enum DISABLE {
	STUN = "STUN",
}

export interface ActiveDisable {
	name: DISABLE;
	duration: number;
}
