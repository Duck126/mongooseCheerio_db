// _id: 5b1aee6150364531909cba2d }
// { link: 'https://www.coindesk.com/quebec-halts-crypto-mining-approvals-pending-new-restrictions/',
//   title: 'Quebec Halts Crypto Mining Approvals Pending New Restrictions',
//   story: 'Jun 8, 2018 at 07:00 | \nNikhilesh De Quebec has halted approvals for new cryptocurrency mining operations while it draws up new rules and may raise energy costs.',
//   date: '2018-06-08T07:00:28+00:00',
//   author: '\nNikhilesh De ',

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articledb = new Schema({
    link: {
    type: String,
    required: true
    },
    title: String,
    story: String,
    date: String,
    author: String
});

var article = mongoose.model("article", articledb);

module.exports = article;