module.exports = (sequelize, dataType) => {

    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT, // 매우 긴 글
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4', // 기본적인 utf8과 차이점 : 한글 + 이모티콘
        collate: 'utf8mb4_general_ci',
    });

    Post.associate = (db) => {
        db.Post.belongsTo(db.User); // belongTo()가 있는 테이블에 다른 테이블의 id를 저장 (Post 테이블에 UserId 저장)
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post);
    };

    return Post;
};