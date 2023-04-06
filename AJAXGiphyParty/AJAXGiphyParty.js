// document.querySelector('#searchButton').addEventListener('click', async function (e) {
//     e.preventDefault();
//     let search = $('input[type="text"]').val();
//     const res = await axios.get('http://api.giphy.com/v1/gifs/search', { params: { q: `'${search}'`, api_key: 'JKhrAxDeW8hIbQqVwa7v7dZJyFHGJv7e' } });

//     const img = document.createElement('img');
//     img.src = res.data.data[Math.floor(Math.random() * res.data.data.length)].images.original.url;
//     const div = document.querySelector('div');
//     div.append(img);
// });

// $('#removeAll').on('click', function () {
//     $('div').children().remove();
// });

async function searchImg() {
    //get user input, request for image, return image to be use
    let search = $('input[type="text"]').val();
    const response = await axios.get('http://api.giphy.com/v1/gifs/search', {
        params: { q: `'${search}'`, api_key: 'JKhrAxDeW8hIbQqVwa7v7dZJyFHGJv7e' },
    });
    const res = response.data;
    return res;
}
//
function addImg(res) {
    //use requested img to append to page
    const img = document.createElement('img');
    img.src = res.data[Math.floor(Math.random() * res.data.length)].images.original.url;
    const div = document.querySelector('div');
    div.append(img);
}
//
document.querySelector('#searchButton').addEventListener('click', (e) => {
    //event listener on click => run func searchImg then func addImg
    e.preventDefault();
    searchImg().then(addImg);
});

$('#removeAll').on('click', function () {
    //event listener on click => remove all images
    $('div').children().remove();
});
