import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Spinner from 'react-bootstrap/Spinner';
import { PostDiv, SpinnerDiv, Post, BtnDiv } from '../../Style/PostDetailCSS';

function Detail() {
  const [PostInfo, setPostInfo] = useState({});
  const [Flag, seFlag] = useState(false);

  let params = useParams();
  let navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    let body = {
      postNum: params.postNum,
    };
    axios
      .post('/api/post/detail', body)
      .then((response) => {
        if (response.data.success) {
          setPostInfo(response.data.post);
          seFlag(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(PostInfo);
  }, [PostInfo]);

  const DeleteHandler = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      let body = {
        postNum: params.postNum,
      };
      axios
        .post('/api/post/delete', body)
        .then((response) => {
          if (response.data.success) {
            alert('게시글이 삭제되었습니다.');
            navigate('/');
          }
        })
        .catch((err) => {
          alert('게시글 삭제에 실패하였습니다.');
        });
    }
  };

  return (
    <PostDiv>
      {Flag ? (
        <>
          <Post>
            <h1>{PostInfo.title}</h1>
            <h3>{PostInfo.author.displayName}</h3>
            {PostInfo.image ? (
              <img
                src={`http://localhost:4000/${PostInfo.image}`}
                alt=""
                style={{ width: '100%', height: 'auto' }}
              />
            ) : null}
            <p>{PostInfo.content}</p>
          </Post>
          {user.udi === PostInfo.author.uid && (
            <BtnDiv>
              <Link to={`/edit/${PostInfo.postNum}`}>
                <button className="edit">수정</button>
              </Link>
              <button className="delete" onClick={() => DeleteHandler()}>
                삭제
              </button>
            </BtnDiv>
          )}
        </>
      ) : (
        <SpinnerDiv>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </SpinnerDiv>
      )}
    </PostDiv>
  );
}

export default Detail;
