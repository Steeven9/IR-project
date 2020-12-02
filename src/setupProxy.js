/* eslint-disable no-undef */
const { createProxyMiddleware } = require("http-proxy-middleware");

let proxyHostname = process.env.REACT_APP_SOLR_HOSTNAME
	? process.env.REACT_APP_SOLR_HOSTNAME
	: "localhost";

module.exports = function (app) {
	app.use(
		"/solr",
		createProxyMiddleware({
			target: "http://" + proxyHostname + ":8983",
			changeOrigin: true,
		})
	);
};
