const Discord = require('discord.js'); 
const { Client, MessageEmbed, Collection, Guild } = require('discord.js');
const client = new Discord.Client({ intents: 32767 })
const fs = require('fs');// Primeros Definimos fs
const { readdirSync } = require('fs');//Definimos readdirSync ya que tambien lo nesitaremos

let prefix = "!"

require('dotenv').config();
const keepAlive = require('./server.js'); //Definimos keepAlive que nos servirá para tener el bot 24/7

   console.log(`Estoy listo!, 
            conectado en ${client.guilds.cache.size} servidores y  ${client.users.cache.size} usuarios.`);
  

function getVowels(str) {
  const m = str.match(/[aeiou]/gi);
  if (m === null) {
    return 0;
  }
  return m.length;
}

console.log(getVowels('sky'));
// expected output: 0

client.commands = new Discord.Collection();//crearmos una collecion para almacenarlo en la cache del bot
const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));// buscamos los archivos que terminen en .js de la carpeta comandos

const eventFiles = fs.readdirSync('./eventos').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./eventos/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

for (const file of commandFiles) {
    const command = require(`./comandos/${file}`);
    client.commands.set(command.name, command);

}

client.on('message', async (message) => {//evento msg en handler
if(!message.content.startsWith(prefix)) return;//si no contiene el prefix retorna
const args = message.content.slice(prefix.length).trim().split(/ +/g); 
if(message.author.bot)return; // filtro si el mesaje es de un bot no lo toma
if(message.channel.type == "dm")return;// filtro solo se puee enviar comandos por mesajes de texto en servidores no DM

const command = args.shift().toLowerCase();

  let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command));
if(cmd){
cmd.execute(client, message, args)
}
});

/////evento uptime 98% de eficacia

const Monitor = require("ping-monitor")

keepAlive();
const monitor = new Monitor({
  website: "WEB-(PUEDES PONER UNA RANDOM O LA DE REPLIT)",
  title: "uptime",
  interval: 3
})
monitor.on('up', (res) => console.log(`${res.website} está encedido.`));
monitor.on('down', (res) => console.log(`${res.website} se ha caído - ${res.statusMessage}`));
monitor.on('stop', (website) => console.log(`${website} se ha parado.`) );
monitor.on('error', (error) => console.log(error));

process.on('unhandledRejection', error => {
        console.error(error);
});

client.on('sharError', error => {
        console.error(error);
});

client.login("TOKEN")



