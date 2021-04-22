import { useState, useEffect, useCallback } from "react";
import { Nav, Card, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";


import { Switch, Route } from "react-router-dom";

import "./App.css";

const bookData = require('./utils/db.json')

// 1. Fetch Book Data
// 2. Render cards to the screen which have the books data
// 3. Define the behavior of viewing one book.
// 4. Define a page which displays the details of an individual book.
// 5. Search for books on search term.
// 6. Limit the number of results.
// 7. 

function BookDetailPage() {
    const { id } = useParams()
    const [book, setBook] = useState({});

    useEffect(() => {
      async function fetchBook() {
        const resp = await fetch("http://localhost:5000/books/" + id);
        const json = await resp.json();
        console.log({ json });
        setBook(json);
      }
      fetchBook();
    }, [id]);
  return (
    <div>
      <h1>Book details!</h1>
      <h3>{book.title}</h3>
    </div>
  );
}

function HomePage() {
  const [pageNum] = useState(1)
  const [query, setQuery] = useState('')
  const [limit] = useState(3)
  const [books, setBooks] = useState([]);

  const fetchBooks = useCallback(
    async (newQuery) => {
      let urlParams = `?_page=${pageNum}&_limit=${limit}`;
      if (query !== "") {
        urlParams = urlParams + `&q=${query}`;
      }

      let json;

      if (process.env.NODE_ENV === 'production') {
        console.log("production");
        json = bookData.books;
        if (newQuery) {
          json = json.filter((b) => {
            return !b.title.toLowerCase().search(newQuery);
          });
        }
      } else {
        console.log("Development");
        const resp = await fetch("http://localhost:5000/books" + urlParams);
        json = await resp.json();
      }

      setBooks(json);
    },
    [limit, pageNum, query],
  );

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const onSearch = (e) => {
    setQuery(e.target.value)
    fetchBooks(e.target.value);
  }

  return (
    <div>
      <h1>HomePage</h1>
      <input onChange={onSearch} />
      <Row>
        {books.map((b) => {
          return (
            <Card key={b.id} className="m-3" style={{ width: "18rem" }}>
              <Card.Img
                variant="top"
                src={"http://localhost:5000/" + b.imageLink}
              />
              <Card.Body>
                <Card.Title>{b.title}</Card.Title>
                <Card.Text>{b.author}</Card.Text>
                <Card.Text>{b.language}</Card.Text>
                <Nav.Link as={Link} to={"/books/" + b.id}>
                  View
                </Nav.Link>
              </Card.Body>
            </Card>
          );
        })}
      </Row>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Container>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/books/:id" exact component={BookDetailPage} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
