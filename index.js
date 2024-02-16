require( "dotenv" ).config();

const express = require( "express" );
// const Database = require("./database.js");
const { createUser, db, Discord } = require( "./utils.js" );


var app = express();



app.get( "/", ( req, res ) => {

  res.send( "yoi!" );

} );
app.listen( 3000, () => {
  console.log( "Bot is running lmao!" );
} );

const client = new Discord.Client();
client.commands = new Discord.Collection();

const prefix = ".";
const fs = require( "fs" );

// const { db } = require("/home/runner/Schatten/db.js");
const Commands = fs.readdirSync( "./BotCommands" ).filter( file => file.endsWith( ".js" ) );
const datas = db.getData();


for ( let file of Commands ) {

  let command = require( `./BotCommands/${ file }` );
  client.commands.set( command.name, command );

}


String.prototype.isNumber = function () { return /^\d+$/.test( this ); };





client.once( 'ready', async () => {

  console.log( `bot on` );
  client.guilds.cache.forEach( async ( guild ) => {
    console.log( `${ guild.name } | ${ guild.id }` );
    // let channel = guild.channels.cache.find(c => c.id = '967279987596091473')
    // let invite = await channel.createInvite(
    //   {
    //     maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
    //     maxUses: 1 // maximum times it can be used
    //   }
    // )
    //   .catch(console.log);
    // console.log("i : " + invite)
  } );
  client.user.setActivity( "You ;) | .help", {
    type: "WATCHING",

  } );


} );

client.on( "guildCreate", ( guild ) => {

  for ( let id of guild.members.cache.map( m => m.id ) ) {

    if ( !db.hasOwnProperty( id ) ) {
      createUser( id, client );
    }

  }

} );

client.on( "guildMemberAdd", ( member ) => {

  if ( !db.hasOwnProperty( member.id ) ) {
    createUser( member.id, client );
  }

} );

client.on( "message", async ( message ) => {

  if ( !message.content.startsWith( prefix ) ) return;

  const args = message.content.trim().slice( prefix.length ).split( / +/ );
  const cmd = args.shift().toLowerCase();
  const command = client.commands.get( cmd ) || client.commands.find( cmdd => cmdd.aliases && cmdd.aliases.includes( cmd ) );


  if ( !command ) return;

  // if()

  if ( command.minArgs > 0 && args.length < command.minArgs ) {

    let reply = `You didn't provide corrent number of arguments, ${ message.author }!`;

    if ( command.usage ) {
      reply += `\nThe proper usage would be: \`${ prefix }${ command.name } ${ command.usage }\``;
    };

    return message.channel.send( reply );
  };

  // Executing commands
  try {
    await command.exec( client, message, args );

  } catch ( error ) {
    console.error( error );
    message.channel.send( `${ message.author } Error :  ${ error.message }` );
  };

} );



client.login( process.env.token );