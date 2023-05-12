const authClient = require('./auth-client');
const index = require('../../index');

const sessions = new Map();

function get(key) {
	return sessions.get(key) ?? create(key);
}

async function create(key) {
	setTimeout(() => sessions.delete(key), 5 * 60 * 1000);
	await update(key);

	return sessions.get(key);
}

async function update(key) {
	return sessions
		.set(key, {
			authUser: await authClient.getUser(key),
			guilds: getManageableGuilds(await authClient.getGuilds(key))
		});
}

async function guild(id) {
	return index.getClient().guilds.cache.get(id);
}

async function channel(guild, id) {
	return guild.channels.cache.get(id);
}

async function channels(guild) {
	return [...guild.channels.cache.values()];
}

async function role(guild, id) {
	return guild.roles.cache.get(id);
}

async function roles(guild) {
	return [...guild.roles.cache.values()]
}

async function channelWithParent(guild, childChannel) {
	let parent = await channel(guild, childChannel.parentId);
	return { ...childChannel, category: parent?.name };
}

async function roleWithColor(role) {
	return { ...role, color: role.color ? `rgb(${(role.color >> 16) & 255}, ${(role.color >> 8) & 255}, ${role.color & 255})` : `rgb(153, 170, 181)` }
}

function getManageableGuilds(authGuilds) {
	const guilds = [];
	const bot = index.getClient();
	for (const id of authGuilds.keys()) {
		const isManager = authGuilds
			.get(id).permissions
			.includes('MANAGE_GUILD');
		const guild = bot.guilds.cache.get(id);
		if (!guild || !isManager) continue;

		guilds.push(guild);
	}
	return guilds;
}

module.exports.get = get;
module.exports.update = update;
module.exports.guild = guild;
module.exports.channel = channel;
module.exports.role = role;
module.exports.roles = roles;
module.exports.channels = channels;
module.exports.channelWithParent = channelWithParent;
module.exports.roleWithColor = roleWithColor;