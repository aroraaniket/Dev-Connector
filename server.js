const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

//connect Database
connectDB();
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve static assests in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


app.listen(process.env.PORT || 5000, function () {
  console.log('server ll started on port 5000');
});
