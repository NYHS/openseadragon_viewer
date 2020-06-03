const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.set('views');
const hbs = exphbs.create({
  defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.get('/', function(request, response) {
  let imageFile = request.query.zoomFile;
  let imageDir = request.query.zoomDir;
  let imageId;
  let imageArray = [];
  if(imageFile) {
    imageId = imageFile.split('.')[0];
    imageArray.push(`/dzi/${imageId}.dzi`);
  } else if(imageDir) {
    //console.log(request.headers.host);
    const host = request.headers.host;
    let tileDir;
    if(host == 'hudsonrising.nyhistory.org') {
      tileDir = path.join(__dirname, 'tiles',imageDir);
    } else if (host == 'firstjewishamericans.nyhistory.org') {
      tileDir = path.join('/var/www/firstjewishamericans/dzi',imageDir);
    }
    //console.log(tileDir);
    try {
      const files = fs.readdirSync(tileDir);
      files.forEach(function (file) {
        if(file.endsWith('.dzi')) {
          let filename = `/dzi/${imageDir}/${file}`;
          //console.log(filename);
          imageArray.push(filename);
        }
      });
    } catch(err) {
      console.log(err);
    }
  }
  //console.log(imageArray);
  response.render('index',{
    id: imageId,
    sources: JSON.stringify(imageArray)
  });
});
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
