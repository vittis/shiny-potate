/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 *  https://github.com/phaserjs/phaser/blob/v3.51.0/src/math/random-data-generator/RandomDataGenerator.js#L278
 *   */

/**
 * A seeded Random Data Generator.
 *
 * Access via `Phaser.Math.RND` which is an instance of this class pre-defined
 * by Phaser. Or, create your own instance to use as you require.
 *
 * The `Math.RND` generator is seeded by the Game Config property value `seed`.
 * If no such config property exists, a random number is used.
 *
 * If you create your own instance of this class you should provide a seed for it.
 * If no seed is given it will use a 'random' one based on Date.now.
 */
class RandomDataGenerator {
	/**
	 * Internal var.
	 */
	private c: number;
	/**
	 * Internal var.
	 */
	private s0: number;
	/**
	 * Internal var.
	 */
	private s1: number;
	/**
	 * Internal var.
	 */
	private s2: number;
	/**
	 * Internal var.
	 */
	private n: number;
	/**
	 * Signs to choose from.
	 */
	private signs: number[];

	constructor(seeds?: string | string[]) {
		if (seeds === undefined) {
			seeds = [(Date.now() * Math.random()).toString()];
		}

		this.c = 1;
		this.s0 = 0;
		this.s1 = 0;
		this.s2 = 0;
		this.n = 0;
		this.signs = [-1, 1];

		if (seeds) {
			this.init(seeds);
		}
	}

	/**
	 * Private random helper.
	 */
	private rnd(): number {
		var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32

		this.c = t | 0;
		this.s0 = this.s1;
		this.s1 = this.s2;
		this.s2 = t - this.c;

		return this.s2;
	}

	/**
	 * Internal method that creates a seed hash.
	 */
	private hash(data: string): number {
		var h;
		var n = this.n;

		data = data.toString();

		for (var i = 0; i < data.length; i++) {
			n += data.charCodeAt(i);
			h = 0.02519603282416938 * n;
			n = h >>> 0;
			h -= n;
			h *= n;
			n = h >>> 0;
			h -= n;
			n += h * 0x100000000; // 2^32
		}

		this.n = n;

		return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
	}

	/**
	 * Initialize the state of the random data generator.
	 */
	init(seeds: string | string[]): void {
		if (typeof seeds === "string") {
			this.state(seeds);
		} else {
			this.sow(seeds);
		}
	}

	/**
	 * Gets or Sets the state of the generator. This allows you to retain the values
	 * that the generator is using between games, i.e. in a game save file.
	 *
	 * To seed this generator with a previously saved state you can pass it as the
	 * `seed` value in your game config, or call this method directly after Phaser has booted.
	 *
	 * Call this method with no parameters to return the current state.
	 *
	 * If providing a state it should match the same format that this method
	 * returns, which is a string with a header `!rnd` followed by the `c`,
	 * `s0`, `s1` and `s2` values respectively, each comma-delimited.
	 */
	state(state?: string): string {
		if (typeof state === "string" && state.match(/^!rnd/)) {
			// @ts-ignore
			state = state.split(",");

			// @ts-ignore
			this.c = parseFloat(state[1]);
			// @ts-ignore
			this.s0 = parseFloat(state[2]);
			// @ts-ignore
			this.s1 = parseFloat(state[3] ?? "");
			// @ts-ignore
			this.s2 = parseFloat(state[4]);
		}

		return ["!rnd", this.c, this.s0, this.s1, this.s2].join(",");
	}

	/**
	 * Reset the seed of the random data generator.
	 */
	sow(seeds: string[]): void {
		this.n = 0xefc8249d;
		this.s0 = this.hash(" ");
		this.s1 = this.hash(" ");
		this.s2 = this.hash(" ");
		this.c = 1;

		if (!seeds) {
			return;
		}

		for (var i = 0; i < seeds.length && seeds[i] != null; i++) {
			var seed = seeds[i];

			this.s0 -= this.hash(seed);
			this.s0 += ~~(this.s0 < 0);
			this.s1 -= this.hash(seed);
			this.s1 += ~~(this.s1 < 0);
			this.s2 -= this.hash(seed);
			this.s2 += ~~(this.s2 < 0);
		}
	}

	/**
	 * Returns a random integer between 0 and 2^32.
	 */
	integer(): number {
		return this.rnd() * 0x100000000; // 2^32
	}

	/**
	 * Returns a random real number between 0 and 1.
	 */
	frac(): number {
		return this.rnd() + ((this.rnd() * 0x200000) | 0) * 1.1102230246251565e-16;
	}

	/**
	 * Returns a random real number between 0 and 2^32.
	 */
	real(): number {
		return this.integer() + this.frac();
	}

	/**
	 * Returns a random integer between and including min and max.
	 */
	integerInRange(min: number, max: number): number {
		return Math.floor(this.realInRange(0, max - min + 1) + min);
	}

	/**
	 * Returns a random integer between and including min and max.
	 */
	between(min: number, max: number): number {
		return Math.floor(this.realInRange(0, max - min + 1) + min);
	}

	/**
	 * Returns a random real number between min and max.
	 */
	realInRange(min: number, max: number): number {
		return this.frac() * (max - min) + min;
	}

	/**
	 * Returns a random real number between -1 and 1.
	 */
	normal(): number {
		return 1 - 2 * this.frac();
	}

	/**
	 * Returns a valid RFC4122 version4 ID hex string.
	 */
	uuid(): string {
		var a = "";
		var b = "";

		for (
			b = a = "";
			// @ts-ignore
			a++ < 36;
			b +=
				// @ts-ignore
				~a % 5 | ((a * 3) & 4)
					? // @ts-ignore
						(a ^ 15 ? 8 ^ (this.frac() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
					: "-"
		);

		return b;
	}

	/**
	 * Returns a random element from within the given array.
	 */
	pick<T>(array: T[]): T {
		return array[this.integerInRange(0, array.length - 1)];
	}

	/**
	 * Returns a sign to be used with multiplication operator.
	 */
	sign(): number {
		return this.pick(this.signs);
	}

	/**
	 * Returns a random element from within the given array, favoring the earlier entries.
	 */
	weightedPick<T>(array: T[]): T {
		return array[~~(Math.pow(this.frac(), 2) * (array.length - 1) + 0.5)];
	}

	/**
	 * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
	 */
	timestamp(min?: number, max?: number): number {
		return this.realInRange(min || 946684800000, max || 1577862000000);
	}

	static instance = new RandomDataGenerator(new Date().getTime().toString()); // todo fixed?
}

const RNG = RandomDataGenerator.instance;

export { RNG };
