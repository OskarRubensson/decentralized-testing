// file system module to perform file operations
const fs = require('fs');
 
// stringify JSON Object

function writeJson(json){
  const jsonContent = JSON.stringify(json);
  fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
   
      console.log("JSON file has been saved.");
  });
}

module.exports = writeJson;