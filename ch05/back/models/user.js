module.exports = (sequelize, dataType) => {

    const User = sequelize.define('User', {

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
        charset: 'utf-8',
        collate: 'utf8_general_ci', // 한글 저장
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
    };

    return User;

};