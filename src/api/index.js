import axios from 'axios'

export default axios.create({
    baseURL: 'http://api.flashcards.local:10080/',
});