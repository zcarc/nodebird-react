
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 테스트 결과 그냥 객체 하나만 넘겨줘도 생성이 된다.
const sequelize = new Sequelize(config);

console.log(`### models/index.js... ###`);
console.log(`### config: ${JSON.stringify(config)} ###`);
// console.log(`### sequelize: ${JSON.stringify(sequelize)} ###`);


db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);


// 이 부분은 위의 DB 연결부 보다 아래에 있어야한다.
// 그래야 db에 있는 associate()를 호출할 수 있다.
Object.keys(db).forEach(modelName => {

  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

