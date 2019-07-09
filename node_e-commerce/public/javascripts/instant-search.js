$(function () {
    $('#instant-search').keyup(() => {
        let searchWord = $('#instant-search').val()

        $.ajax({
            method: "POST",
            url: '/api/product/instant-search',
            data: {
                search: searchWord
            },
            dataType: 'json',
            success: (data) => {
                
                if(data.length === 0) {
                    $('#search-results').empty()

                    $('#search-results').append("Product you are looking for is not found").addClass('s-flex justify-content-center alert alert-warning')
                } else {
                    $('#search-results').empty().removeClass('d-flex justify-content-center alert alert-warning')

                    for(let i = 0; i < data.length; i++) {
                        let html = '';

                        html += '<div class="col">'      
                        html += '<div class="card">'
                        html += `<a href="/api/product/${data[i]._id}">`
                        html += `<img class="card-img-top" src="${data[i]._source.image}" alt="Card image cap" />`
                        html += '</a>' 
                        html += '<div class="card-body">'
                        html += `<h5 class="card-title">Name: ${data[i]._source.name} </h5>`
                        html += `<p class="card-text">Category: ${data[i]._source.category.name} </p>`
                        html += `<p class="card-text">$ ${data[i]._source.price} </p>`
                        html += `<a href="/api/product/${data[i]._source._id}" class="btn btn-primary">Shop</a>`
                        html += '</div>'
                        html += '</div>'
                        html += '</div>'

                        $('#search-results').append(html)
                    }
                }
            },
            error: (error) => {
                console.log('error: ', error);
                
            }
        })
    })

})
