document.querySelector('#searchButton').addEventListener('click', async function (e) {
    e.preventDefault();
    let search = $('input[type="text"]').val();
    const res = await axios.get('http://api.giphy.com/v1/gifs/search', { params: { q: `'${search}'`, api_key: 'JKhrAxDeW8hIbQqVwa7v7dZJyFHGJv7e' } });
    const img = document.createElement('img');
    img.src = res.data.data[Math.floor(Math.random() * res.data.data.length)].images.original.url;
    const div = document.querySelector('div');
    div.append(img);
});

$('#removeAll').on('click', function () {
    $('div').children().remove();
});

// async function getGIF(search) {
//     const res = await axios.get('http://api.giphy.com/v1/gifs/search', { params: { q: `'${search}'`, api_key: 'JKhrAxDeW8hIbQqVwa7v7dZJyFHGJv7e' } });
//     return res;
// }

// function addImg(res) {
//     const img = document.createElement('img');
//     img.src = res.data.data[0].images.original.url;
//     const body = document.querySelector('body');
//     body.prepend(img);
// }

// $('form').on('submit', function (e) {
//     e.preventDefault();
//     let search = $('input[type="text"]').val();
//     getGIF(search);
//     addImg(res);
// });
// document.querySelector('form').addEventListener('submit', function (e) {
//     e.preventDefault();
//     console.log('form submitted');
// });
