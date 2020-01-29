module.exports = (sequelize, DataTypes) => {

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

        // belongTo()가 있는 테이블에 다른 테이블의 id를 저장 (Post 테이블에 UserId 저장)
        // 테이블에 UserId 컬럼이 생긴다.
        db.Post.belongsTo(db.User); 

        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, { as: 'Retweet' }); // 테이블에 RetweetId 컬럼이 생긴다.
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag'} );
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers'});
    };

    return Post;
};