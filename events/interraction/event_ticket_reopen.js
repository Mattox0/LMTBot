const {EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder} = require('discord.js');
let date = new Date()

module.exports = {
    name:'ticket_reopen',
    description:'Reouvre un ticket',
    async execute(...params) {
        let interaction = params[0];
        let db = params[3];
        db.get("SELECT * FROM tickets WHERE channel_id = ?",interaction.channelId, async (err, res) => {
            if (err || !res) {
                return interaction.reply({content:'il y a eu une erreur...', ephemeral:true});
            }
            if (res.deleted === 0) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription('<a:LMT_arrow:1065548690862899240> **Le ticket n\'est pas fermé, tu ne peux pas le re-ouvrir !**')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            chann = await interaction.member.guild.channels.cache.find(channel => channel.id === res.channel_id);
            chann.permissionOverwrites.edit(res.user_id, {VIEW_CHANNEL:true});
            chann.setName(chann.name.replace('closed','ticket'));
            db.run('UPDATE tickets SET deleted = 0 WHERE id = ?', res.id, (err) => {if (err) console.log(err)});
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ticket_close')
                        .setLabel('🔒 Fermer')
                        .setStyle(ButtonStyle.Secondary)
                )
            const mess = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`Le ticket a été ré-ouvert par ${interaction.member} !\n\n> Pour fermer le ticket appuie sur 🔒`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            chann.send({embeds:[mess], components:[row]});
            interaction.deferUpdate();
        })
    }
}