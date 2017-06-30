import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'



class SearchBooks extends Component {
    state = {
        maxResults: 20,
        query: '',
        searchResults: []
    }

    updateQuery = (query) => {
        BooksAPI.search(query, this.state.maxResults).then((books) => {
            this.setState({
                query: query,
                searchResults: books instanceof Array ? books : []
            })
        })
    }

    updateBook = (book, e) => {
        const values = {
            book: book,
            shelf: e.target.value
        }
        if(this.props.onUpdateBook) {
            this.props.onUpdateBook(values);
        }
    }

    render() {
        const {query, searchResults} = this.state

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/"/>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={query}
                            onChange={(event) => this.updateQuery(event.target.value)}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {searchResults.map((book) => (
                            <li key={book.id}>
                                <div className="book">
                                    <div className="book-top">
                                        {book.imageLinks !== undefined && (
                                            <div className="book-cover" style={{
                                                width: 128,
                                                height: 193,
                                                backgroundImage: `url(${book.imageLinks.thumbnail})`
                                            }}></div>
                                        )}

                                        {book.imageLinks === undefined && (
                                            <div className="book-cover" style={{
                                                width: 128,
                                                height: 193,
                                            }}></div>
                                        )}

                                        <div className="book-shelf-changer">
                                            <select onChange={(e) => this.updateBook(book, e)} value={book.shelf}>
                                                <option value="none" disabled>Move to...</option>
                                                <option value="currentlyReading">Currently Reading
                                                </option>
                                                <option value="wantToRead">Want to Read</option>
                                                <option value="read">Read</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    <div className="book-authors">{book.authors !== undefined ? book.authors.join(", ") : ''}</div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchBooks