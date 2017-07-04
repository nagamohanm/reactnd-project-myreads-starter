import React from 'react'
import {Route} from 'react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactLoading from 'react-loading'

import * as BooksAPI from './BooksAPI'

import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'


import '../node_modules/react-notifications/lib/notifications.css'
import './App.css'

class BooksApp extends React.Component {
    state = {
        allBooks: [],
        books: {},
        isLoading: false
    }

    fetchMyReads() {
        return BooksAPI.getAll().then((books) => {
            let myBooks = {
                currentlyReading: [],
                wantToRead: [],
                read: []
            }

            myBooks.currentlyReading = books.filter(book => book.shelf === 'currentlyReading')
            myBooks.wantToRead = books.filter(book => book.shelf === 'wantToRead')
            myBooks.read = books.filter(book => book.shelf === 'read')

            this.setState({books: myBooks, allBooks: books})
        })
    }

    componentDidMount() {
        this.setState({isLoading: true})
        this.fetchMyReads().then(() => {
            this.setState({isLoading: false})
        })
    }

    updateBook(bookToUpdate) {
        BooksAPI.update(bookToUpdate.book, bookToUpdate.shelf).then((shelfBooks) => {
            this.fetchMyReads().then(() => {
                NotificationManager.success('Book added to "' + bookToUpdate.shelf + '"', '');
            })
        })
    }

    render() {
        return (
            <div className="app">
                {this.state.isLoading && (
                    <div className="loading">
                        <ReactLoading type="bubbles" color="#444"/>
                    </div>
                )}
                {!this.state.isLoading && (
                    <div>
                        <Route
                            path="/search"
                            render={() => (
                                <SearchBooks
                                    onUpdateBook={(bookToUpdate) => {
                                        this.updateBook(bookToUpdate)
                                    }}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <ListBooks
                                    onUpdateBook={(bookToUpdate) => {
                                        this.updateBook(bookToUpdate)
                                    }}
                                    books={this.state.books}
                                />
                            )}
                        />
                        <NotificationContainer />
                    </div>
                )}
            </div>
        )
    }
}

export default BooksApp
