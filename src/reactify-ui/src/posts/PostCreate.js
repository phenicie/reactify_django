import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import moment from "moment";

class PostCreate extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.handleDraftChange = this.handleDraftChange.bind(this);
    this.postTitleRef = React.createRef();
    this.state = {
      draft: false,
      title: null,
      content: null,
      publish: null,
      errors: {}
    };
  }
  createPosts(data) {
    const endpoint = "/api/posts/";
    const csrfToken = cookie.load("csrftoken");
    let thisComp = this;
    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(data)
      };

      fetch(endpoint, lookupOptions)
        .then(function(response) {
          return response.json();
        })
        .then(function(responseData) {
          console.log(responseData);
          if (thisComp.props.newPostItemCreated) {
            thisComp.props.newPostItemCreated(responseData);
          }
          thisComp.clearForm();
        })
        .catch(function(error) {
          console.log("error", error);
          alert("An Error Occured");
        });
    }
  }

  handleDraftChange(event) {
    // if (data["draft"] === "on") {
    //   data["draft"] = true;
    // } else {
    //   data["draft"] = false;
    // }
    this.setState({
      draft: !this.state.draft
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = this.state;
    // console.log(data);
    this.createPosts(data);
  }
  handleInputChange(event) {
    event.preventDefault();
    let key = event.target.name;
    let value = event.target.value;
    if (key === "title") {
      if (value.length > 120) {
        alert("This title is too long");
      }
    }
    this.setState({
      [key]: value
    });
  }

  clearForm(event) {
    if (event) {
      event.preventDefault();
    }
    this.postCreateForm.reset();
  }

  componentDidMount() {
    this.setState({
      draft: false,
      title: null,
      content: null,
      publish: moment().format("YYYY-MM-DD")
    });
    this.postTitleRef.current.focus();
  }
  render() {
    const { publish } = this.state;
    return (
      <form onSubmit={this.handleSubmit} ref={el => (this.postCreateForm = el)}>
        <div className="form-group">
          <label for="title">Post Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Blog Post Title"
            ref={this.postTitleRef}
            onChange={this.handleInputChange}
            required="required"
          />
        </div>
        <div className="form-group">
          <label for="content">Content</label>
          <textarea
            id="conent"
            name="content"
            className="form-control"
            placeholder="Post Content"
            onChange={this.handleInputChange}
            required="required"
          />
        </div>
        <div className="form-group">
          <label for="draft">
            <input
              type="checkbox"
              id="draft"
              name="draft"
              className="mr-2"
              placeholder=""
              onChange={this.handleDraftChange}
              checked={this.state.draft}
            />
            Draft
          </label>
          <button
            onClick={event => {
              event.preventDefault();
              this.handleDraftChange(event);
            }}
          >
            {" "}
            Toggle Event{" "}
          </button>
        </div>
        <div className="form-group">
          <label for="publish"> Publish Date</label>
          <input
            type="date"
            id="publish"
            name="publish"
            className="form-control"
            placeholder=""
            onChange={this.handleInputChange}
            value={publish}
            required="required"
          />
        </div>
        <button className="btn btn-primary"> Save </button>
        <button className="btn btn-secondary" onClick={this.clearForm}>
          Cancel{" "}
        </button>
      </form>
    );
  }
}

export default PostCreate;