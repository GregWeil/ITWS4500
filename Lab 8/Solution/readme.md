Lab 8 - node.js SPARQL & RDF
Web Science Systems Dev
Greg Weil

Send a SPARQL query and show the results

/server.js
	The node server hosts the contents of the public directory
	The query page is available at localhost:3000
	GETs to /query get passed through to the SPARQL endpoint
		Use the query parameter ?query to define the query
		Results will be in JSON format

/public/index.html
	The public facing query page, it has a textbox and a space for results
/public/js/index.js
	Manage the web page using JQuery
	When the form is submitted send the query to the server
	When receiving results, format them into the table
		Use the vars section to identify returned fields in the header
		Use the value type to show URIs as links

Resources
	NodeJS, with the express and request libraries are used for the server
	JQuery and Bootstrap are used on the client side
	dbpedia.org is accessed for its database representation of Wikipedia
