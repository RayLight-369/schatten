const fs = require("fs");
const log = console.log;
const error = console.error;

function getValueFromObject(obj, path) {
  return path.reduce((current, key) => {
    if (current && current.hasOwnProperty(key)) {
      return current[key];
    } else {
      throw new Error('path not found');
    }
  }, obj);
}

function updateObjectValue(obj, path, newValue, append) {
  path.reduce((current, key, i) => {
      console.log("key: ", key)
    if ((path.length == 0 || typeof path == "string") && !current.hasOwnProperty(key)) throw new Error(`Invalid path: ${key} not found`);
    
    if (i === path.length - 1) {
            
      if (append) {
              
        if (typeof newValue == "object" && !Array.isArray(newValue) && typeof newValue != "boolean") {
                
          current[key] = { ...current[key], ...newValue };
          
        } else {
          throw new Error("Strings, Numbers, Arrays cannot be Appended.")
        }
        
      } else {
        current[key] = newValue;
      }
      
    } else {
      current = current[key];
      console.log(current);
    }
    return current;
  }, obj);
  return obj;
  
}



class Database {

  constructor(name, path) {
    this.name = name;
    this.path = `${this.name}.json`;
    this.pathSeperator = ":";
    if (!fs.existsSync(this.path)) {
      fs.writeFile(`${this.path}`, "{\n\n\n}", err => {
        if (err) console.error(err);
      });
    }
  }

  getData(keys) {
    let data = JSON.parse(fs.readFileSync(this.path).toString());
    let chain = Array.isArray(keys) ? keys : keys.split(this.pathSeperator).map(item => item.trim());

    if (keys) {
      
      try {
        return getValueFromObject(data, chain);
      } catch (e) {
        console.log(e);
      }

    } else {
      return data;
    }
  }

  writeData(keys, val, append = false) {

    let data = JSON.parse(fs.readFileSync(this.path).toString());
    let chain = Array.isArray(keys) ? keys : keys.split(this.pathSeperator).map(elem => typeof elem == "string" ? elem.trim() : elem);
    try {
      
      data = updateObjectValue(data, chain, val, append);

      if (val) {

        fs.writeFileSync(this.path, JSON.stringify(data));

        return data[chain[0]];

      } else {
        
        return new Error("Value expected!");
        
    }

    } catch (e) {
      console.log(e)
    }

    // let _data = await this.getData(key);

    

  }

  dataFromOptions({ from, limit, mode = "after", order = "asc", filter }) {
    let data = JSON.parse(fs.readFileSync(this.path).toString());
    if (order == "desc") {
      data = Object.entries(data).reverse().reduce((p, c) => {
        p[c[0]] = c[1];
        return p;
      }, {});
    }
    let lastindex, limit_, data_ = {};

    if (mode == "after") {

      lastindex = from ? Object.keys(data).findIndex(key => key == from) + 1 : 1;

      limit_ = limit && Object.keys(data).length - lastindex >= limit ? limit : Object.keys(data).length - lastindex;

    } else if (mode == "at") {

      lastindex = from || from != undefined ? Object.keys(data).findIndex(key => key == from) : 0;

      limit_ = limit && Object.keys(data).length - lastindex >= limit ? limit : Object.keys(data).length - lastindex;

    }

    if (lastindex != undefined) {

      if (!filter) {

        for (let i = lastindex; i <= lastindex + limit_ - 1; i++) {
          let current = Object.entries(data)[i];
          data_[current[0]] = current[1];
        }

      } else {
        let conditional = 0;
        for (let i = lastindex; i < Object.entries(data).length; i++) {
          let current = Object.entries(data)[i];
          if (filter.every(item => current[1].tags.includes(item)) || current[1].question.split(" ").some(item => filter.includes(item))) {

            data_[current[0]] = current[1];

            conditional++;

          }

          if (conditional == limit) break;

        }

      }
    }

    return (data_);
  }

  exists(key) {

    let data = JSON.parse(fs.readFileSync(this.path).toString());

    if (key in data) return true;

    return false;

  }

  delKey(key) {
    let data = this.getData();
    if (key in data) {
      delete data[key];
    }

    fs.writeFileSync(this.path, JSON.stringify(data));
  }

  getKey(key) {
    let key_, keys = Object.keys(JSON.parse(fs.readFileSync(this.path).toString()));

    key_ = key == "last" ? keys[keys.length - 1] : keys[key];

    return key_;
  }

  clear() {
    fs.writeFileSync(this.path, "{\n\n\n}");
  }

  del() {
    fs.unlinkSync(this.path);
  }

}


module.exports = Database;