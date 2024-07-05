import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import {useNavigate} from 'react-router-dom';

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            id: response.data.id, // Make sure to include the ID
            commentBody: newComment,
            username: response.data.username,
          };
          //console.log("New ID: ", response.data.id);
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate('/');
      });
  };

  const editPost = (option) => {
    if (option === 'title'){
      //Prompt editing the title
      let newTitle = prompt("Enter New Title:");
      if (newTitle === null){
        newTitle = postObject.title;
      }
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostObject({ ...postObject, title: newTitle });
    }else{
      //Prompt editing the post body
      let newPostText = prompt("Enter New Text:");
      if (newPostText === null){
        newPostText = postObject.postText;
      }
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  }

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div 
            className="title" 
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          > 
            {postObject.title} 
          </div>
          <div 
            className="body" 
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            <Link to={`/profile/${authState.id}`}>{postObject.username}</Link>
            {authState.username === postObject.username && (
              <button 
                onClick={() => {
                  deletePost(postObject.id)
                }}
              >
                {" "}
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;