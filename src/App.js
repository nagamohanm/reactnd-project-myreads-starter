import React from 'react'
import { Route } from 'react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import * as BooksAPI from './BooksAPI'

import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'


import '../node_modules/react-notifications/lib/notifications.css'
import './App.css'

class BooksApp extends React.Component {
    state = {
        allBooks: [],
        books: {}
    }

    componentDidMount() {
        BooksAPI.getAll().then((books) => {
            let myBooks = {
                currentlyReading: [],
                wantToRead: [],
                read: []
            }

            myBooks.currentlyReading = books.filter(book => book.shelf === 'currentlyReading')
            myBooks.wantToRead = books.filter(book => book.shelf === 'wantToRead')
            myBooks.read = books.filter(book => book.shelf === 'read')

            this.setState({ books: myBooks, allBooks: books })
        })
    }

    updateBook(bookToUpdate) {
        BooksAPI.update(bookToUpdate.book, bookToUpdate.shelf).then((books) => {
            let myBooks = this.state.books;

            let indexToUpdate = this.state.allBooks.map(book => book.id).indexOf(bookToUpdate.book.id)

            BooksAPI.get(bookToUpdate.book.id).then((updatedBook) => {
                console.log(indexToUpdate)
                console.log(updatedBook)
                if(indexToUpdate > -1) this.state.allBooks.splice(indexToUpdate, 1, updatedBook)

                myBooks.currentlyReading = this.state.allBooks.filter(book => books.currentlyReading.includes(book.id) );
                myBooks.wantToRead = this.state.allBooks.filter(book => books.wantToRead.includes(book.id) );
                myBooks.read = this.state.allBooks.filter(book => books.read.includes(book.id) );

                this.setState({ books: myBooks, allBooks: this.state.allBooks })

                NotificationManager.success('Book added to ' + bookToUpdate.shelf , '');
            })
        })
    }

    render() {
        return (
            <div className="app">
                <Route
                    path="/search"
                    render={( {history} ) => (
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
                    render={( {history} ) => (
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
        )
    }
}

export default BooksApp
