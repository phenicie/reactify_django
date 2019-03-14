import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import PostInline from "./PostInline";
import PostCreate from "./PostCreate";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.togglePostListClass = this.togglePostListClass.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);

    this.state = {
      posts: [],
      postListClass: "card"
    };
  }
  loadPosts() {
    const endpoint = "/api/posts/";
    let thisComp = this;
    let lookupOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    fetch(endpoint, lookupOptions)
      .then(function(response) {
        return response.json();
      })
      .then(function(responseData) {
        console.log(responseData);
        thisComp.setState({
          posts: responseData
        });
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  handleNewPost(postItemData) {
    console.log(postItemData);
    let currentPosts = this.state.posts;
    currentPosts.unshift(postItemData); //unshift
    this.setState({
      posts: currentPosts
    });
  }

  togglePostListClass(event) {
    event.preventDefault();
    let currentListClass = this.state.postListClass;
    if (currentListClass === "") {
      this.setState({
        postListClass: "card"
      });
    } else {
      this.setState({
        postListClass: ""
      });
    }
  }

  componentDidMount() {
    this.setState({
      posts: [],
      postListClass: "card"
    });
    this.loadPosts();
  }

  render() {
    const csrfToken = cookie.load("csrftoken");
    const { posts } = this.state;
    const { postListClass } = this.state;
    return (
      <div>
        <h1>Hellow World</h1>
        <button onClick={this.togglePostListClass}> Toggle Class </button>
        {posts.length > 0 ? (
          posts.map((postItem, index) => {
            return <PostInline post={postItem} elClass={postListClass} />;
          })
        ) : (
          <p> No Posts Found</p>
        )}
        {csrfToken !== undefined && csrfToken !== null ? (
          <div className="my-5">
            <PostCreate newPostItemCreated={this.handleNewPost} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Posts;
