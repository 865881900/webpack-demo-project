const express = require('express');
const { renderToString } = require('react-dom/server');
const { SSRHome } = require('../dist/ssrHome/index.js');
const { SSRSearch } = require('../dist/ssrSearch/index.js');
const fs = require('fs');
const path = require('path');
const ssrHomeTemplate = fs.readFileSync(path.join(__dirname, '../dist/SsrHome/index.html'), 'utf-8');
const ssrSearchTemplate = fs.readFileSync(path.join(__dirname, '../dist/SsrSearch/index.html'), 'utf-8');

const server = (port) => {
  const app = new express();
  app.use(express.static('dist'));

  app.get('/search', (req, res) => {
    const htmlTemplate = renderMarkUp(ssrSearchTemplate, renderToString(SSRSearch));
    res.send(htmlTemplate);
  });

  app.get('/home', (req, res) => {
    const htmlTemplate = renderMarkUp(ssrHomeTemplate, renderToString(SSRHome));
    res.send(htmlTemplate);
  });


  app.listen(port, () => {
    console.log(`ssr 服务器启动成功,端口:${port}`);
  });
};
const renderMarkUp = (template, str) => {
  return template.replace('<!--STATIC_TEMPLATE-->', str);
};
server(process.env.PORT || 3000);
