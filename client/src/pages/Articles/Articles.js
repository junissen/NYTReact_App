import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { Card, CardItem } from "../../components/Card";
import { Input, FormBtn, DropDown } from "../../components/Form";
import Nav from "../../components/Nav";
import axios from "axios";
import moment from "moment"

class Articles extends Component {
  state = {
    articles: [],
    numberReturned: "",
    savedArticles: [],
    numberSaved: "",
    search: "",
    startYear: "",
    endYear: "",
    number: ""
  };

  componentDidMount() {
    this.loadSavedArticles();
  }

  loadSavedArticles = () => {
    API.getArticles()
      .then(res => {
        console.log(res)
        this.setState({savedArticles: res.data})
        this.setState({numberSaved: res.data.length})
        this.printSavedArticles();
      })
      .catch(err => console.log(err))
  }

  printSavedArticles = () => {
    console.log(this.state.savedArticles)
    console.log(this.state.numberSaved)
  }

  loadArticles = () => {
  
    if (this.state.search) {
      console.log(`Search: ${this.state.search} from ${this.state.startYear} to ${this.state.endYear}, return ${this.state.number} results`)
    
      var authKey = "efcea28019104d479052a9e17852cc5f";
      // var authKey = "b9f91d369ff59547cd47b931d8cbc56b:0:74623931";
      var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
        authKey + "&q=";
      var searchURL = queryURLBase + this.state.search;

      if (parseInt(this.state.startYear, 10)) {
        searchURL = searchURL + "&begin_date=" + this.state.startYear + "0101";
      }

      if (parseInt(this.state.endYear, 10)) {
        searchURL = searchURL + "&end_date=" + this.state.endYear + "0101";
      }

      axios.get(searchURL)
      .then(NYTData => {

        var articleArray = [];

        let numberReturned = "";

        if (this.state.number > NYTData.data.response.docs.length) {
          numberReturned = NYTData.data.response.docs.length
        }

        else {
          numberReturned = this.state.number
        }

        for (var i = 0; i < numberReturned; i++) {
          var photoLink = "";

          if (NYTData.data.response.docs[i].multimedia) {
            if (NYTData.data.response.docs[i].multimedia[2]) {
              photoLink = NYTData.data.response.docs[i].multimedia[2].url
            }
          }

          else {
            photoLink = "None"
          }

          var newObject = {
            id: i + 1, 
            title: NYTData.data.response.docs[i].headline.main,
            summary: NYTData.data.response.docs[i].snippet,
            link: NYTData.data.response.docs[i].web_url,
            photo: photoLink,
            date: moment(NYTData.data.response.docs[i].pub_date).format("LL")
          }
          articleArray.push(newObject)
        }

        this.setState({articles: articleArray})
        this.setState({numberReturned: numberReturned})
        this.printArticles();
      })
      .catch(err => console.log(err))
    }

  };

  printArticles = () => {
    console.log(this.state.articles)
    console.log(this.state.numberReturned)
  };

  deleteArticle = event => {
    let articleId = event.target.id
    API.deleteArticle(articleId)
      .then(res => this.loadSavedArticles())
      .catch(err => console.log(err));
  };

  saveArticle = event => {
    let articleId = event.target.id;
    let articleInfo = this.state.articles[articleId - 1];

    console.log(articleInfo);

    API.saveArticle({
      title: articleInfo.title,
      summary: articleInfo.summary,
      link: articleInfo.link,
      photo: articleInfo.photo,
      date: articleInfo.date
    })
      .then(res => this.loadSavedArticles())
      .catch(err => console.log(err.response));
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    this.loadArticles();
  };

  render() {
    return (
      <Container fluid>
        <Nav />
        <Row>
          <Col size="sm-1">
          </Col>
          <Col size="sm-10">

            <div className="card searchCard">
              <div className="card-header">Search Parameters: </div>
              <div className="card-body">
                <form>
                  <Input
                    value={this.state.search}
                    onChange={this.handleInputChange}
                    id="search"
                    name="search"
                    label="Enter Search Term"
                  />

                  <DropDown
                    value={this.state.number}
                    onChange={this.handleInputChange}
                    name="number"
                  />

                  <Input
                    value={this.state.startYear}
                    onChange={this.handleInputChange}
                    name="startYear"
                    id="startYear"
                    label="Enter Start Year (Optional)"
                  />

                  <Input
                    value={this.state.endYear}
                    onChange={this.handleInputChange}
                    name="endYear"
                    id="endYear"
                    label="Enter End Year (Optional)"
                  />

                  <FormBtn
                    disabled={!(this.state.search)}
                    onClick={this.handleFormSubmit}
                  >
                    Submit Search
                  </FormBtn>
                </form>
              </div>
            </div>

          </Col>

          <Col size="sm-1">
          </Col>
        </Row>
        <Row>
          <Col size="sm-1">
          </Col>
          <Col size="sm-10">

          {this.state.articles.length ? ( 
            
            <div>

              <h1>{this.state.numberReturned} Articles Returned </h1>
              {this.state.articles.map(article => (
                
                <Card>
                  <div className="row">
                  <Col size="sm-9">
                    <CardItem 
                      key={article.id}
                      title={article.title}
                      summary={article.summary}
                      link={article.link}
                      photo={article.photo}
                      date={article.date}
                    />
                  </Col>
                  <Col size="sm-3">
                    <SaveBtn 
                      id={article.id}
                      onClick={this.saveArticle}
                    />
                  </Col>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <h3>No Search Results to Display</h3>
          )}  
            
          </Col>
          <Col size="sm-1">
          </Col>
        </Row>
        <Row>
          <Col size="sm-1">
          </Col>
          <Col size="sm-10">
            {this.state.savedArticles.length ? (
              <div>
                <h1>{this.state.numberSaved} Articles Saved </h1>
                {this.state.savedArticles.map(savedArticle => (
                  <Card>
                  <div className="row">
                  <Col size="sm-9">
                    <CardItem 
                      key={savedArticle.id}
                      title={savedArticle.title}
                      summary={savedArticle.summary}
                      link={savedArticle.link}
                      photo={savedArticle.photo}
                      date={savedArticle.date}
                    />
                  </Col>
                  <Col size="sm-3">
                    <DeleteBtn 
                      id={savedArticle._id}
                      onClick={this.deleteArticle}
                    />
                  </Col>
                  </div>
                </Card>
                ))}
              </div>
            ) : (
              <h3>No Saved Articles to Display</h3>
            )}
          </Col>
          <Col size="sm-1">
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Articles;
