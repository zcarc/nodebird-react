module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', { // User 처럼 앞에 대문자를 하나 붙이면 users로 변하는데 'U'는 'u'로 단수형에서 복수형으로 바뀐다.

        nickname: {
            type: DataTypes.STRING(20), // 20자 이하
            allowNull: false, // null을 허용하지 않는다.
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true, // 고유값
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장
        // tableName: 'posts' //테이블명 직접 정의
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post, { as: 'Post' });
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked'});
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings' });
    };

    return User;

};