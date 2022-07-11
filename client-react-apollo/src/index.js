import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';


// Import of all necessary dependencies from apollo client - think of these as the components for the local server
import {
  ApolloProvider, // this and the next one down assemble the apollo server instance itself
  ApolloClient,
  createHttpLink, // creates a uri for the client to connect to the graphql server
  InMemoryCache 
} from "@apollo/client"  

// declare uri for apollo/graphql server
const httpLink = createHttpLink({
  uri: "http://localhost:4000"
});  

// instantiate a new Apollo client, passing in the uri above and creating a new memory cache.
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

// renders the app wrapped in the apolloprovider, which is passed the client as a prop. Neat. 
ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById("root")
);