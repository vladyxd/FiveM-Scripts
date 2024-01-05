const express = require('express');
const ytsr = require('ytsr');
const app = express();
const port = 2912;
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

app.use(express.json());

app.post("/search", async (req, res) => {
    const { query } = req.body;
    let searchResult = [];

    await ytsr(query, { limit: 3 }).then((result) => {
        result.items.forEach((item) => {
            if (item.type === 'video') {
                searchResult.push({
                    title: item.title,
                    url: item.url,
                    thumbnail: item.bestThumbnail,
                    duration: item.duration,
                });
            }
        });
    });

    res.send(JSON.stringify(searchResult));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
