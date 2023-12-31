const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Transforme votre phrase en une phrase emoji')
        .addStringOption(option => option.setName('texte').setDescription('Votre texte à transformer en emoji | Exemple : "Coucou" | Que des caractères alphanumériques').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let text = interaction.options.getString('texte');
        let emojis = [':regional_indicator_a:',':regional_indicator_b:',':regional_indicator_c:',':regional_indicator_d:',':regional_indicator_e:',':regional_indicator_f:',':regional_indicator_g:',':regional_indicator_h:',':regional_indicator_i:',':regional_indicator_j:',':regional_indicator_k:',':regional_indicator_l:',':regional_indicator_m:',':regional_indicator_n:',':regional_indicator_o:',':regional_indicator_p:',':regional_indicator_q:',':regional_indicator_r:',':regional_indicator_s:',':regional_indicator_t:',':regional_indicator_u:',':regional_indicator_v:',':regional_indicator_w:',':regional_indicator_x:',':regional_indicator_y:',':regional_indicator_z:','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','0️⃣','     ']
        let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0',' '];
        let phrase = "";
        for (let x of text) {
            if (alphabet.includes(x.toLowerCase())) {
                phrase += emojis[alphabet.indexOf(x.toLowerCase())];
            }
        }
        if (phrase.length === 0) {
            return interaction.reply({content:'Merci de ne rentrer que des caractères alphanumériques',ephemeral:true});
        }
        return interaction.reply({content:`${phrase}`});
    }
}