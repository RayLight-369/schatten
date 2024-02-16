const fs = require( "fs" );
const log = console.log;
const error = console.error;


class Database {

  constructor ( name, path ) {
    this.name = name;
    this.path = `./AllData/${ this.name }.json`;
    if ( !fs.existsSync( this.path ) ) {
      fs.writeFile( `${ this.path }`, "{\n\n\n}", err => {
        if ( err ) console.error( err );
      } );
    }
  }

  getData ( key ) {
    let data = JSON.parse( fs.readFileSync( this.path ).toString() );
    if ( key ) {
      if ( key in data ) {
        return data[ key ];
      } else {
        return new Error( "Key does not exists" );
      }
    } else {
      return data;
    }
  }

  writeData ( key, val, append = false ) {
    let data = JSON.parse( fs.readFileSync( this.path ).toString() );
    // let _data = await this.getData(key);

    if ( val ) {

      if ( append ) {
        data[ key ] = { ...data[ key ], ...val };
      } else {
        data[ key ] = val;
      }

      fs.writeFileSync( this.path, JSON.stringify( data ) );

      return data[ key ];

    } else {
      return new Error( "Value expected!" );
    }

  }

  dataFromOptions ( { from, limit, mode = "after", order = "asc", filter } ) {
    let data = JSON.parse( fs.readFileSync( this.path ).toString() );
    if ( order == "desc" ) {
      data = Object.entries( data ).reverse().reduce( ( p, c ) => {
        p[ c[ 0 ] ] = c[ 1 ];
        return p;
      }, {} );
    }
    let lastindex, limit_, data_ = {};

    if ( mode == "after" ) {

      lastindex = from ? Object.keys( data ).findIndex( key => key == from ) + 1 : 1;

      limit_ = limit && Object.keys( data ).length - lastindex >= limit ? limit : Object.keys( data ).length - lastindex;

    } else if ( mode == "at" ) {

      lastindex = from || from != undefined ? Object.keys( data ).findIndex( key => key == from ) : 0;

      limit_ = limit && Object.keys( data ).length - lastindex >= limit ? limit : Object.keys( data ).length - lastindex;

    }

    if ( lastindex != undefined ) {

      if ( !filter ) {

        for ( let i = lastindex; i <= lastindex + limit_ - 1; i++ ) {
          let current = Object.entries( data )[ i ];
          data_[ current[ 0 ] ] = current[ 1 ];
        }

      } else {
        let conditional = 0;
        for ( let i = lastindex; i < Object.entries( data ).length; i++ ) {
          let current = Object.entries( data )[ i ];
          if ( filter.every( item => current[ 1 ].tags.includes( item ) ) || current[ 1 ].question.split( " " ).some( item => filter.includes( item ) ) ) {

            data_[ current[ 0 ] ] = current[ 1 ];

            conditional++;

          }

          if ( conditional == limit ) break;

        }

      }
    }

    return ( data_ );
  }

  exists ( key ) {

    let data = JSON.parse( fs.readFileSync( this.path ).toString() );

    if ( key in data ) return true;

    return false;

  }

  delKey ( key ) {
    let data = this.getData();
    if ( key in data ) {
      delete data[ key ];
    }

    fs.writeFileSync( this.path, JSON.stringify( data ) );
  }

  getKey ( key ) {
    let key_, keys = Object.keys( JSON.parse( fs.readFileSync( this.path ).toString() ) );

    key_ = key == "last" ? keys[ keys.length - 1 ] : keys[ key ];

    return key_;
  }

  clear () {
    fs.writeFileSync( this.path, "{\n\n\n}" );
  }

  del () {
    fs.unlinkSync( this.path );
  }

}


module.exports = Database;