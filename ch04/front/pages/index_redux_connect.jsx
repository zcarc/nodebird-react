import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { connect } from 'react-redux';
import { LOG_IN, LOG_OUT, loginAction, logoutAction } from '../reducers/user';

const dummy = {
    isLoggedIn: true,
    imagePaths: [],
    mainPosts: [{
        User: {
            id: 1,
            nickname: '이현수',
        },
        content: '첫 번째 게시글',
        img: 'https://img.jakpost.net/c/2019/12/08/2019_12_08_83319_1575794264._large.jpg',
    }],
};

// mapDispatchToProps()를 사용하는 경우: login, logout 추가
// const Home = ({ login, logout }) => {


// mapStateToProps()를 사용하는 경우
const Home = ({ user, dispatch }) => {
    console.log('Index() component...');

    // const dispatch = useDispatch();
    // const {isLoggedIn, user} = useSelector(state => state.user);


    // mapStateToProps()를 사용하는 경우
    useEffect(() => {
        
        // dispatch()에 들어가는 객체가 action 인데
        // 이것은 dispatch()를 여러번 선언해서 action을 넣어줄 수 있다. 
        dispatch({
            type: LOG_IN,
            data: {
                nickname: '이현수',
            },
        });

        dispatch({
            type: LOG_OUT,
        });


        // user.jsx의 action 객체를 import해서 사용한다.
        dispatch(loginAction);

        // dispatch(logoutAction);


    }, []);


    // mapDispatchToProps()를 사용하는 경우
    // useEffect(() => {
        
    //     login();
    //     logout();
    //     login();

    // }, []);

    return (
        <div>
            { user ? <div>로그인 했습니다: { user.nickname }</div> : <div>로그아웃 했습니다.</div>}
            {dummy.isLoggedIn && <PostForm />}

                {dummy.mainPosts.map( (c) => {
                    return (
                      <PostCard key={c} post={c} />  
                    );
                })}
        </div>
    );
};

// 리덕스 state를 리액트 props로 바꾼다는 의미 (1:1 매핑)
// 매개변수 state는 리덕스에 의해 root reducer에 등록된 state들을 전부 가져와서 매개변수로 받는다.
// 그리고 그 state중에서 user이라는 state를 선택해서 user가 있는 객체를 반환한다.
// 그리고 Home 컴포넌트가 user state를 받는다.
//
function mapStateToProps(state) {

    return {
        user: state.user,
    };
}

// action 자체를 dispatch 해서 반환해준다.
// 매개변수 dispatch는 리덕스에서 알아서 전달해준다.
// 그리고 dispatch로 action을 실행한 결과값을 반환받고
// 그 객체를 Home 컴포넌트로 전달해서 useEffect()에서 함수를 호출한다.
function mapDispatchToProps(dispatch) {

    return {
        login: () => dispatch(loginAction),
        logout: () => dispatch(logoutAction),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);