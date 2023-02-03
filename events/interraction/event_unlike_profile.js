const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')
let date = new Date()

module.exports = {
    name:'unlike_profile',
    description:'Check les unlikes des profils',
    async execute(...params) {
        let interaction = params[0]
        let db = params[3]
        let id = interaction.message.content.split(',')[0].replace(/\D/g,'');
        let member = await interaction.member.guild.members.cache.find(x => x.id === id);
        if (!member) {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **Cette personne ne fais plus partie du serveur...**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail], ephemeral:true});
        }
        db.get('SELECT * FROM profile WHERE user_id = ?', member.user.id, async (err, res) => {
            if (err) return console.log(err);
            if (!res) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Cette personne ne fais plus partie du serveur...**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail], ephemeral:true});
            }
            res.likes = JSON.parse(res.likes);
            if (!res.likes.likes.includes(interaction.user.id)) {
                const fail = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Tu n'as pas like cette personne !**`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({embeds:[fail], ephemeral:true});
            } else {
                res.likes.likes = res.likes.likes.filter(x => x !== interaction.user.id);
                db.run('UPDATE profile SET likes = ? WHERE user_id = ?', JSON.stringify(res.likes), member.user.id, (err) => {if (err) console.log(err) });
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('like_profile')
                            .setLabel('Like')
                            .setEmoji('❤️')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('unlike_profile')
                            .setLabel('Unlike')
                            .setEmoji('💔')
                            .setStyle(ButtonStyle.Danger)
                    )
                const view = new EmbedBuilder()
                    .setColor(`#${res.couleur_hexa ? res.couleur_hexa : '2f3136'}`)
                    .setAuthor({name:`${member.user.username} ・ ${res.likes.likes.length} ❤️`, iconURL:member.user.displayAvatarURL({dynamic: true})})
                    .setThumbnail(`${res.image ? res.image : member.user.displayAvatarURL({dynamic: true})}`)
                    .setFooter({text:`${res.footer ? res.footer : `LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`}`})
                    .setDescription(`${res.description ? res.description : ''}\n\n${ res.pseudo ? `> \`Pseudo\` <a:LMT_arrow:1065548690862899240> ${res.pseudo}\n` : ''}${ res.film ? `> \`Film favoris\` <a:LMT_arrow:1065548690862899240> ${res.film}\n` : ''}${ res.musique ? `> \`Style musical\` <a:LMT_arrow:1065548690862899240> ${res.musique}\n` : ''}${res.couleur ? `> \`Couleur favorite\` <a:LMT_arrow:1065548690862899240> ${res.couleur}\n` : ''}${ res.repas ? `> \`Repas favoris\` <a:LMT_arrow:1065548690862899240> ${res.repas}\n` : ''}${res.adjectifs ? `> \`Personnalité\` <a:LMT_arrow:1065548690862899240> ${res.adjectifs}` : ''}`)
                await interaction.message.edit({content:`${member}, **Voici ton profil :**`,embeds:[view], components:[row]});
                await interaction.deferUpdate();
            }
        })
    }
}