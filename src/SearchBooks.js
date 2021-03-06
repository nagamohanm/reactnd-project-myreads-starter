import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ReactLoading from 'react-loading'

/**
 * SearchBooks Component
 */
class SearchBooks extends Component {
    /**
     *
     * @type {{maxResults: number, query: string, searchResults: Array, resultsFetched: boolean}}
     */
    state = {
        maxResults: 20,
        query: '',
        searchResults: [],
        resultsFetched: true
    }

    /**
     * Update query and fetch books from server based on the query
     * @param query
     */
    updateQueryAndFetchBooks = (query) => {
        if(query.length === 0) {
            this.setState({query, searchResults: []})
        }

        if(query.length > 0) {
            this.setState({query, resultsFetched: false, searchResults: []})
            // Display loading icon by setting a timeout of 2000ms
            setTimeout(() => {
                BooksAPI.search(query, this.state.maxResults).then((books) => {
                    this.setState({
                        searchResults: books instanceof Array ? books : [],
                        resultsFetched: true
                    })
                })
            }, 2000)
        }
    }

    /**
     *  Update shelf of the selected book.
     * @param book
     * @param e
     */
    updateBook = (book, e) => {
        const values = {
            book: book,
            shelf: e.target.value
        }
        if (this.props.onUpdateBook) {
            this.props.onUpdateBook(values);
        }
    }

    /**
     * render
     * @returns {string}
     */
    render() {
        const {query, searchResults, resultsFetched} = this.state

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/"/>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={query}
                            onChange={(event) => this.updateQueryAndFetchBooks(event.target.value)}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    {!resultsFetched && (
                        <div className="loading">
                            <ReactLoading type="bubbles" color="#444"/>
                        </div>
                    )}
                    <ol className="books-grid">
                        {searchResults.map((book, i) => (
                            <li key={i}>
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
                                                height: 193
                                            }}></div>
                                        )}

                                        <div className="book-shelf-changer">
                                            <select onChange={(e) => this.updateBook(book, e)} value={book.shelf}>
                                                <option value="none" disabled>Move to...</option>
                                                <option value="currentlyReading">Currently Reading
                                                </option>
                                                <option value="wantToRead">Want to Read</option>
                                                <option value="read">Read</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    <div
                                        className="book-authors">{book.authors !== undefined ? book.authors.join(", ") : ''}</div>
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