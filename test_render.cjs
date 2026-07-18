const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="root"></div></body></html>`, { url: "http://localhost:5173" });
console.log("DOM loaded");
