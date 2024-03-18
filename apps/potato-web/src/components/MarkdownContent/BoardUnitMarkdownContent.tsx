import { Unit } from "game-logic";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface MarkdownContentProps {
	unit: Unit;
}

const BoardUnitMarkdownContent = ({ unit }: MarkdownContentProps) => {
	const className = unit.classManager.class.data.name;

	const allAbilities = unit.abilities;
	const allPerks = unit.perks;
	const stats = unit.stats;

	return (
		<div className="bg-pattern-gradient p-3 font-mono">
			<div className="text-4xl text-center">{className}</div>
			<Separator className="my-4" />

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3">
					{allAbilities.map(ability => {
						const damageEffect = ability.data.effects.find(effect => effect.type === "DAMAGE");
						return (
							<div key={ability.id} className="flex flex-col">
								<div className="text-amber-300 mb-1 flex items-center gap-1">
									<span className="text-xl">{ability.data.name}</span>
									{ability.data.tags.map(tag => (
										<Badge key={tag} size="sm" variant="secondary" className="capitalize">
											{tag}
										</Badge>
									))}
								</div>
								<div className="flex gap-1">
									<Badge variant="secondary" className="capitalize">
										{ability.data.type}
									</Badge>
									<Badge variant="secondary" className="capitalize">
										{ability.data.target}
									</Badge>
									<Badge variant="secondary" className="capitalize">
										CD: {ability.data.cooldown}
									</Badge>
									{damageEffect && (
										<Badge variant="secondary" className="capitalize">
											{/* @ts-ignore */}
											Dmg: {damageEffect.payload?.value}
										</Badge>
									)}
									{ability.data.baseDamage && (
										<Badge variant="secondary" className="capitalize">
											Dmg: {ability.data.baseDamage}
										</Badge>
									)}
								</div>
							</div>
						);
					})}
				</div>

				{allPerks.length > 0 && (
					<>
						<Separator />

						<div>
							{allPerks.map(perk => {
								return (
									<div key={perk.id} className="flex flex-col">
										<div className="flex items-center">
											<span className="font-mono text-green-300">
												{perk.tier} <span className="text-primary">{perk.data.name}</span>
											</span>
										</div>
										<div className="flex gap-1"></div>
									</div>
								);
							})}
						</div>
					</>
				)}

				<Separator />

				<div>
					<div>
						HP: <span className="text-green-300">{stats.hp}</span>
					</div>
					{stats.attackDamageModifier > 0 && (
						<div>
							<span className="text-green-300">{stats.attackDamageModifier}%</span> increased{" "}
							<span className="text-primary">Attack Damage</span>
						</div>
					)}
					{stats.attackCooldownModifier > 0 && (
						<div>
							<span className="text-green-300">{stats.attackCooldownModifier}%</span> increased{" "}
							<span className="text-primary">Attack Cooldown Recovery</span>
						</div>
					)}
					{stats.spellDamageModifier > 0 && (
						<div>
							<span className="text-green-300">{stats.spellDamageModifier}%</span> increased{" "}
							<span className="text-primary">Spell Damage</span>
						</div>
					)}
					{stats.spellCooldownModifier > 0 && (
						<div>
							<span className="text-green-300">{stats.spellCooldownModifier}%</span> increased{" "}
							<span className="text-primary">Spell Cooldown Recovery</span>
						</div>
					)}
					{stats.damageReductionModifier > 0 && (
						<div>
							<span className="text-green-300">{stats.damageReductionModifier}%</span>{" "}
							<span className="text-primary">Damage Reduction</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export { BoardUnitMarkdownContent };
