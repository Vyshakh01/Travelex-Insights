import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
export default function PostDemo({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
  likedBy,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/SinglePost/${_id}`}>
          <img src={"http://localhost:5000/" + cover} alt="" />
        </Link>
      </div>
      <div className="text">
        <Link to={`/SinglePost/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>

          <time>{format(new Date(createdAt), "MMM d , yyy hh:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
        <div className="likecount">
          <FontAwesomeIcon icon={faHeart} color={"green"} />
          <p>{likedBy.length}</p>
        </div>
      </div>
    </div>
  );
}
